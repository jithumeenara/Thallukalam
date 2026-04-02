import analyticsData from '@google-analytics/data'

const { BetaAnalyticsDataClient } = analyticsData

const DEFAULT_START_DATE = '2026-04-02'
const DEFAULT_PAGE_PATH = '/'
const DEFAULT_METRIC = 'screenPageViews'

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 's-maxage=60, stale-while-revalidate=300',
}

declare global {
  // eslint-disable-next-line no-var
  var thallikalamAnalyticsClient: BetaAnalyticsDataClient | undefined
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  })
}

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim()
  return value ? value : null
}

function createClient(clientEmail: string, privateKey: string) {
  if (!globalThis.thallikalamAnalyticsClient) {
    globalThis.thallikalamAnalyticsClient = new BetaAnalyticsDataClient({
      fallback: true,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    })
  }

  return globalThis.thallikalamAnalyticsClient
}

export async function GET() {
  const propertyId = readRequiredEnv('GA4_PROPERTY_ID')
  const clientEmail = readRequiredEnv('GA4_CLIENT_EMAIL')
  const privateKeyRaw = process.env.GA4_PRIVATE_KEY

  const missing: string[] = []
  if (!propertyId) missing.push('GA4_PROPERTY_ID')
  if (!clientEmail) missing.push('GA4_CLIENT_EMAIL')
  if (!privateKeyRaw?.trim()) missing.push('GA4_PRIVATE_KEY')

  if (missing.length > 0) {
    return json(
      {
        code: 'CONFIG_ERROR',
        error: 'GA4 server configuration is incomplete.',
        missing,
      },
      500,
    )
  }

  const metric = readRequiredEnv('GA4_COUNT_METRIC') || DEFAULT_METRIC
  const startDate = readRequiredEnv('GA4_START_DATE') || DEFAULT_START_DATE
  const pagePath = readRequiredEnv('GA4_PAGE_PATH') || DEFAULT_PAGE_PATH

  try {
    const client = createClient(clientEmail, privateKeyRaw.replace(/\\n/g, '\n'))

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

    return json({
      value: Number.isFinite(value) ? value : 0,
      metric,
      pagePath,
      startDate,
      updatedAt: new Date().toISOString(),
      source: 'google-analytics-data-api',
    })
  } catch (error) {
    return json(
      {
        code: 'GA4_REQUEST_ERROR',
        error: error instanceof Error ? error.message : 'Failed to fetch GA4 visit count.',
      },
      500,
    )
  }
}
