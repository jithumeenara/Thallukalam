import json
import math

W, H = 200, 200
CX, CY = 100, 100

layers = []
lid = 0

# 1. Cursor arrow shape (pink, pointing upper-left)
arrow_path = {
    "i": [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
    "o": [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
    "v": [
        [-12, -12],
        [-12, 8],
        [-8, 4],
        [4, 16],
        [7, 13],
        [-4, 2],
    ],
    "c": True
}

lid += 1
cursor_layer = {
    "ddd": 0, "ind": lid, "ty": 4, "nm": "cursor",
    "sr": 1,
    "ks": {
        "o": {"a": 0, "k": 100, "ix": 11},
        "r": {"a": 0, "k": 0, "ix": 10},
        "p": {"a": 0, "k": [CX, CY, 0], "ix": 2},
        "a": {"a": 0, "k": [0, 0, 0], "ix": 1},
        "s": {
            "a": 1, "k": [
                {"i": {"x": [0.667,0.667,0.667],"y": [1,1,1]},
                 "o": {"x": [0.333,0.333,0.333],"y": [0,0,0]},
                 "t": 0, "s": [0,0,100], "e": [100,100,100]},
                {"i": {"x": [0.667,0.667,0.667],"y": [1,1,1]},
                 "o": {"x": [0.333,0.333,0.333],"y": [0,0,0]},
                 "t": 6, "s": [100,100,100], "e": [110,110,100]},
                {"i": {"x": [0.667,0.667,0.667],"y": [1,1,1]},
                 "o": {"x": [0.333,0.333,0.333],"y": [0,0,0]},
                 "t": 10, "s": [110,110,100], "e": [100,100,100]},
                {"t": 14, "s": [100,100,100]}
            ], "ix": 6
        }
    },
    "ao": 0,
    "shapes": [
        {
            "ty": "gr",
            "it": [
                {
                    "ind": 0, "ty": "sh", "ix": 1,
                    "ks": {"a": 0, "k": arrow_path, "ix": 2},
                    "nm": "Path 1"
                },
                {
                    "ty": "fl",
                    "c": {"a": 0, "k": [1, 0.3, 0.6, 1], "ix": 4},
                    "o": {"a": 0, "k": 100, "ix": 5},
                    "r": 1,
                    "nm": "Fill 1"
                },
                {
                    "ty": "st",
                    "c": {"a": 0, "k": [1, 1, 1, 1], "ix": 3},
                    "o": {"a": 0, "k": 100, "ix": 4},
                    "w": {"a": 0, "k": 1.5, "ix": 5},
                    "lc": 2, "lj": 2, "ml": 4,
                    "nm": "Stroke 1"
                },
                {
                    "ty": "tr",
                    "p": {"a": 0, "k": [0, 0], "ix": 2},
                    "a": {"a": 0, "k": [0, 0], "ix": 1},
                    "s": {"a": 0, "k": [100, 100], "ix": 3},
                    "r": {"a": 0, "k": 0, "ix": 6},
                    "o": {"a": 0, "k": 100, "ix": 7},
                    "sk": {"a": 0, "k": 0, "ix": 4},
                    "sa": {"a": 0, "k": 0, "ix": 5},
                    "nm": "Transform"
                }
            ],
            "nm": "cursor shape", "np": 4, "cix": 2, "ix": 1
        }
    ],
    "ip": 0, "op": 40, "st": 0, "bm": 0
}
layers.append(cursor_layer)

# 2. 8 radial burst lines
angles = [i * 45 for i in range(8)]
r_inner = 18
r_outer = 40

pinks = [
    [1, 0.2, 0.5, 1],
    [1, 0.4, 0.6, 1],
    [0.95, 0.1, 0.55, 1],
    [1, 0.5, 0.7, 1],
]

for i, angle in enumerate(angles):
    lid += 1
    rad = math.radians(angle)
    x1 = math.cos(rad) * r_inner
    y1 = math.sin(rad) * r_inner
    x2 = math.cos(rad) * r_outer
    y2 = math.sin(rad) * r_outer

    line_path = {
        "i": [[0,0],[0,0]],
        "o": [[0,0],[0,0]],
        "v": [[x1, y1],[x2, y2]],
        "c": False
    }

    color = pinks[i % len(pinks)]
    start_t = 8
    end_t = 28

    layer = {
        "ddd": 0, "ind": lid, "ty": 4, "nm": "line" + str(i+1),
        "sr": 1,
        "ks": {
            "o": {
                "a": 1, "k": [
                    {"i": {"x": [0.667], "y": [1]}, "o": {"x": [0.333], "y": [0]},
                     "t": start_t, "s": [0], "e": [100]},
                    {"i": {"x": [0.667], "y": [1]}, "o": {"x": [0.333], "y": [0]},
                     "t": start_t+5, "s": [100], "e": [100]},
                    {"i": {"x": [0.667], "y": [1]}, "o": {"x": [0.333], "y": [0]},
                     "t": end_t-6, "s": [100], "e": [0]},
                    {"t": end_t, "s": [0]}
                ], "ix": 11
            },
            "r": {"a": 0, "k": 0, "ix": 10},
            "p": {"a": 0, "k": [CX, CY, 0], "ix": 2},
            "a": {"a": 0, "k": [0, 0, 0], "ix": 1},
            "s": {"a": 0, "k": [100, 100, 100], "ix": 6}
        },
        "ao": 0,
        "shapes": [
            {
                "ty": "gr",
                "it": [
                    {
                        "ind": 0, "ty": "sh", "ix": 1,
                        "ks": {"a": 0, "k": line_path, "ix": 2},
                        "nm": "Path 1"
                    },
                    {
                        "ty": "st",
                        "c": {"a": 0, "k": color, "ix": 3},
                        "o": {"a": 0, "k": 100, "ix": 4},
                        "w": {"a": 0, "k": 3, "ix": 5},
                        "lc": 2, "lj": 1, "ml": 4,
                        "nm": "Stroke 1"
                    },
                    {
                        "ty": "tr",
                        "p": {"a": 0, "k": [0, 0], "ix": 2},
                        "a": {"a": 0, "k": [0, 0], "ix": 1},
                        "s": {"a": 0, "k": [100, 100], "ix": 3},
                        "r": {"a": 0, "k": 0, "ix": 6},
                        "o": {"a": 0, "k": 100, "ix": 7},
                        "sk": {"a": 0, "k": 0, "ix": 4},
                        "sa": {"a": 0, "k": 0, "ix": 5},
                        "nm": "Transform"
                    }
                ],
                "nm": "line" + str(i+1) + " grp", "np": 3, "cix": 2, "ix": 1
            },
            {
                "ty": "tm",
                "s": {
                    "a": 1, "k": [
                        {"i": {"x": [0.5], "y": [1]}, "o": {"x": [0.5], "y": [0]},
                         "t": start_t, "s": [0], "e": [0]},
                        {"t": end_t, "s": [100]}
                    ], "ix": 1
                },
                "e": {
                    "a": 1, "k": [
                        {"i": {"x": [0.25], "y": [1]}, "o": {"x": [0.5], "y": [0]},
                         "t": start_t, "s": [0], "e": [100]},
                        {"t": start_t+12, "s": [100]}
                    ], "ix": 2
                },
                "o": {"a": 0, "k": 0, "ix": 3},
                "m": 1, "ix": 2,
                "nm": "Trim Paths 1"
            }
        ],
        "ip": start_t, "op": 40, "st": 0, "bm": 0
    }
    layers.append(layer)

# 3. Expanding ring ripple
lid += 1
ring_layer = {
    "ddd": 0, "ind": lid, "ty": 4, "nm": "ripple",
    "sr": 1,
    "ks": {
        "o": {
            "a": 1, "k": [
                {"i": {"x": [0.667], "y": [1]}, "o": {"x": [0.333], "y": [0]},
                 "t": 8, "s": [80], "e": [80]},
                {"i": {"x": [0.667], "y": [1]}, "o": {"x": [0.333], "y": [0]},
                 "t": 20, "s": [80], "e": [0]},
                {"t": 30, "s": [0]}
            ], "ix": 11
        },
        "r": {"a": 0, "k": 0, "ix": 10},
        "p": {"a": 0, "k": [CX, CY, 0], "ix": 2},
        "a": {"a": 0, "k": [0, 0, 0], "ix": 1},
        "s": {
            "a": 1, "k": [
                {"i": {"x": [0.25, 0.25, 0.667], "y": [1, 1, 1]},
                 "o": {"x": [0.5, 0.5, 0.333], "y": [0, 0, 0]},
                 "t": 8, "s": [10, 10, 100], "e": [130, 130, 100]},
                {"t": 30, "s": [130, 130, 100]}
            ], "ix": 6
        }
    },
    "ao": 0,
    "shapes": [
        {
            "ty": "gr",
            "it": [
                {
                    "d": 1, "ty": "el",
                    "s": {"a": 0, "k": [30, 30], "ix": 2},
                    "p": {"a": 0, "k": [0, 0], "ix": 3},
                    "nm": "Ellipse Path 1"
                },
                {
                    "ty": "st",
                    "c": {"a": 0, "k": [1, 0.3, 0.6, 1], "ix": 3},
                    "o": {"a": 0, "k": 100, "ix": 4},
                    "w": {"a": 0, "k": 2.5, "ix": 5},
                    "lc": 1, "lj": 1, "ml": 4,
                    "nm": "Stroke 1"
                },
                {
                    "ty": "tr",
                    "p": {"a": 0, "k": [0, 0], "ix": 2},
                    "a": {"a": 0, "k": [0, 0], "ix": 1},
                    "s": {"a": 0, "k": [100, 100], "ix": 3},
                    "r": {"a": 0, "k": 0, "ix": 6},
                    "o": {"a": 0, "k": 100, "ix": 7},
                    "sk": {"a": 0, "k": 0, "ix": 4},
                    "sa": {"a": 0, "k": 0, "ix": 5},
                    "nm": "Transform"
                }
            ],
            "nm": "ripple grp", "np": 3, "cix": 2, "ix": 1
        }
    ],
    "ip": 8, "op": 40, "st": 0, "bm": 0
}
layers.append(ring_layer)

lottie = {
    "v": "5.7.4",
    "fr": 30,
    "ip": 0,
    "op": 40,
    "w": W,
    "h": H,
    "nm": "click sparkle",
    "ddd": 0,
    "assets": [],
    "layers": layers
}

out = json.dumps(lottie, separators=(",", ":"))
print("Size: {} bytes = {} KB".format(len(out), len(out)//1024))

with open("e:/Thallikalam/public/lottie/click.json", "w") as f:
    f.write(out)
print("Written to e:/Thallikalam/public/lottie/click.json")
