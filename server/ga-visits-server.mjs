import 'dotenv/config'
import http from 'node:http'
import analyticsData from '@google-analytics/data'

const { BetaAnalyticsDataClient } = analyticsData

const DEFAULT_START_DATE = '2026-04-02'
const DEFAULT_PAGE_PATH = '/'
const DEFAULT_METRIC = 'screenPageViews'
const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 3010

let analyticsClient

function sendJson(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

function readRequiredEnv(name) {
  const value = process.env[name]?.trim()
  return value ? value : null
}

function getClient(clientEmail, privateKey) {
  if (!analyticsClient) {
    analyticsClient = new BetaAnalyticsDataClient({
      fallback: true,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    })
  }

  return analyticsClient
}

async function getVisitCount() {
  const propertyId = readRequiredEnv('GA4_PROPERTY_ID')
  const clientEmail = readRequiredEnv('GA4_CLIENT_EMAIL')
  const privateKeyRaw = process.env.GA4_PRIVATE_KEY

  const missing = []
  if (!propertyId) missing.push('GA4_PROPERTY_ID')
  if (!clientEmail) missing.push('GA4_CLIENT_EMAIL')
  if (!privateKeyRaw?.trim()) missing.push('GA4_PRIVATE_KEY')

  if (missing.length > 0) {
    return {
      status: 500,
      body: {
        code: 'CONFIG_ERROR',
        error: 'GA4 server configuration is incomplete.',
        missing,
      },
    }
  }

  const metric = readRequiredEnv('GA4_COUNT_METRIC') || DEFAULT_METRIC
  const startDate = readRequiredEnv('GA4_START_DATE') || DEFAULT_START_DATE
  const pagePath = readRequiredEnv('GA4_PAGE_PATH') || DEFAULT_PAGE_PATH

  try {
    const client = getClient(clientEmail, privateKeyRaw.replace(/\\n/g, '\n'))

    const [report] = await client.runReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: metric }],
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'EXACT',
            value: pagePath,
          },
        },
      },
      limit: 1,
    })

    const value = Number(report.rows?.[0]?.metricValues?.[0]?.value ?? 0)

    return {
      status: 200,
      body: {
        value: Number.isFinite(value) ? value : 0,
        metric,
        pagePath,
        startDate,
        updatedAt: new Date().toISOString(),
        source: 'google-analytics-data-api',
      },
    }
  } catch (error) {
    return {
      status: 500,
      body: {
        code: 'GA4_REQUEST_ERROR',
        error: error instanceof Error ? error.message : 'Failed to fetch GA4 visit count.',
      },
    }
  }
}

const server = http.createServer(async (req, res) => {
  const origin = `http://${req.headers.host || 'localhost'}`
  const url = new URL(req.url || '/', origin)

  if (req.method === 'GET' && url.pathname === '/api/ga-visits') {
    const result = await getVisitCount()
    sendJson(res, result.status, result.body)
    return
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true })
    return
  }

  sendJson(res, 404, {
    error: 'Not found',
  })
})

const host = process.env.GA4_API_HOST || DEFAULT_HOST
const port = Number(process.env.GA4_API_PORT || DEFAULT_PORT)

server.listen(port, host, () => {
  console.log(`GA4 API listening on http://${host}:${port}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      process.exit(0)
    })
  })
}
