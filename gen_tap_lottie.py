"""
Generates public/lottie/tap.json
Flat-design pointing finger tap with soft bounce + gold ripple.
30fps · 90 frames (3 s loop) · 80×110 canvas · transparent bg
"""
import json, os

W, H, FR, OP = 80, 110, 30, 90

GOLD  = [0.788, 0.635, 0.153, 1]
WHITE = [1.0,   1.0,   1.0,   1]
CREAM = [0.96,  0.92,  0.84,  1]
SKIN  = [0.94,  0.79,  0.67,  1]
PINK  = [0.95,  0.80,  0.78,  1]
DARK  = [0.18,  0.12,  0.06,  1]

CX          = W / 2      # 40
REST_Y      = 52         # finger centre at rest
PRESS_Y     = 67         # finger centre pressed
RIPPLE_Y    = 88         # ripple origin

# ── helpers ────────────────────────────────────────────────────────────────

def tr(px=0, py=0, sx=100, sy=100, r=0, o=100):
    return {"ty":"tr","p":{"a":0,"k":[px,py]},"a":{"a":0,"k":[0,0]},
            "s":{"a":0,"k":[sx,sy]},"r":{"a":0,"k":r},"o":{"a":0,"k":o}}

def static(val):
    return {"a":0,"k":val}

def kf(t, s, e=None, ei=0.25, eo=0.75):
    d = {"t":t,"s":s if isinstance(s,list) else [s],
         "i":{"x":[ei],"y":[ei]},"o":{"x":[eo],"y":[eo]}}
    if e is not None:
        d["e"] = e if isinstance(e,list) else [e]
    return d

def kf3(t, s, e=None, ei=0.25, eo=0.75):
    d = {"t":t,"s":s,"i":{"x":[ei,ei,ei],"y":[ei,ei,ei]},
         "o":{"x":[eo,eo,eo],"y":[eo,eo,eo]}}
    if e is not None:
        d["e"] = e
    return d

# ── finger position (Y axis animation) ─────────────────────────────────────

def finger_pos():
    return {"a":1,"k":[
        kf3(0,  [CX,REST_Y ,0],[CX,REST_Y ,0], 0.5,0.5),
        kf3(10, [CX,REST_Y ,0],[CX,PRESS_Y,0], 0.2,0.8),   # press
        kf3(22, [CX,PRESS_Y,0],[CX,PRESS_Y-4,0], 0.4,0.6), # micro bounce
        kf3(28, [CX,PRESS_Y-4,0],[CX,PRESS_Y,0], 0.4,0.6), # settle
        kf3(44, [CX,PRESS_Y,0],[CX,REST_Y-8,0], 0.2,0.8),  # lift  (overshoot)
        kf3(56, [CX,REST_Y-8,0],[CX,REST_Y,0], 0.3,0.7),   # spring back
        kf3(66, [CX,REST_Y,0],[CX,REST_Y,0], 0.5,0.5),
        kf3(OP, [CX,REST_Y,0]),
    ]}

# squish on press
def finger_scale():
    return {"a":1,"k":[
        kf3(0, [100,100,100],[100,100,100], 0.5,0.5),
        kf3(18,[100,100,100],[108,88,100], 0.2,0.8),
        kf3(26,[108,88,100],[100,100,100], 0.3,0.7),
        kf3(OP,[100,100,100]),
    ]}

base_ks = {"o":static(100),"r":static(0),"p":finger_pos(),
           "a":static([0,0,0]),"s":finger_scale()}

# ── ripple layer factory ───────────────────────────────────────────────────

def ripple(idx, sf, color, dia):
    ef = sf + 40
    return {
        "ty":4,"nm":f"rpl{idx}","ind":idx,"sr":1,
        "ip":sf,"op":OP,"st":0,
        "ks":{
            "o":{"a":1,"k":[
                kf(sf,[70],[0], 0.2,0.8),
                kf(ef,[0]),
            ]},
            "r":static(0),
            "p":static([CX,RIPPLE_Y,0]),
            "a":static([0,0,0]),
            "s":{"a":1,"k":[
                kf3(sf,[100,100,100],[420,420,100], 0.15,0.85),
                kf3(ef,[420,420,100]),
            ]},
        },
        "shapes":[
            {"ty":"el","nm":"c","p":static([0,0]),"s":static([dia,dia])},
            {"ty":"st","nm":"s","c":static(color),"o":static(100),
             "w":static(2.2),"lc":2,"lj":2},
            tr(),
        ],
        "ao":0
    }

# ── finger body (shaft + tip merged, single cream fill) ────────────────────

SHAFT_W, SHAFT_H = 15, 36
TIP_D            = 15
NAIL_W, NAIL_H   = 9, 7

finger_layer = {
    "ty":4,"nm":"finger","ind":10,"sr":1,"ip":0,"op":OP,"st":0,
    "ks": base_ks,
    "shapes":[
        # — finger body group ———————————————————————
        {"ty":"gr","nm":"body","it":[
            {"ty":"rc","nm":"shaft",
             "p":static([0,-10]),"s":static([SHAFT_W,SHAFT_H]),"r":static(7)},
            {"ty":"el","nm":"tip",
             "p":static([0, SHAFT_H/2-10]),"s":static([TIP_D,TIP_D])},
            {"ty":"fl","nm":"fill","c":static(SKIN),"o":static(100),"r":1},
            {"ty":"st","nm":"stroke","c":static(DARK),"o":static(70),
             "w":static(1.4),"lc":2,"lj":2},
            tr(),
        ]},
        # — nail group ——————————————————————————————
        {"ty":"gr","nm":"nail","it":[
            {"ty":"rc","nm":"nail",
             "p":static([0,-26]),"s":static([NAIL_W,NAIL_H]),"r":static(3)},
            {"ty":"fl","nm":"fill","c":static(PINK),"o":static(100),"r":1},
            {"ty":"st","nm":"stroke","c":static(DARK),"o":static(50),
             "w":static(1.0),"lc":2,"lj":2},
            tr(),
        ]},
        # — knuckle lines ————————————————————————————
        {"ty":"gr","nm":"knuckles","it":[
            {"ty":"sh","nm":"k1","ks":static({"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-5,-18],[5,-18]],"c":False})},
            {"ty":"sh","nm":"k2","ks":static({"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-4,-11],[4,-11]],"c":False})},
            {"ty":"st","nm":"s","c":static([0.6,0.5,0.4,1]),"o":static(45),
             "w":static(1.2),"lc":2,"lj":2},
            tr(),
        ]},
    ],
    "ao":0
}

# ── tap-flash dot ──────────────────────────────────────────────────────────

flash = {
    "ty":4,"nm":"flash","ind":20,"sr":1,"ip":20,"op":40,"st":0,
    "ks":{
        "o":{"a":1,"k":[
            kf(20,[0],[100], 0.2,0.8),
            kf(28,[100],[0], 0.3,0.7),
            kf(40,[0]),
        ]},
        "r":static(0),
        "p":static([CX,RIPPLE_Y,0]),
        "a":static([0,0,0]),
        "s":{"a":1,"k":[
            kf3(20,[60,60,100],[180,180,100], 0.2,0.8),
            kf3(40,[180,180,100]),
        ]},
    },
    "shapes":[
        {"ty":"el","nm":"dot","p":static([0,0]),"s":static([10,10])},
        {"ty":"fl","nm":"fill","c":static(GOLD),"o":static(100),"r":1},
        tr(),
    ],
    "ao":0
}

# ── assemble ───────────────────────────────────────────────────────────────

lottie = {
    "v":"5.7.4","fr":FR,"ip":0,"op":OP,"w":W,"h":H,
    "nm":"finger-tap","ddd":0,"assets":[],
    "layers":[
        flash,
        finger_layer,
        ripple(2, 26, WHITE, 10),
        ripple(1, 22, GOLD,  14),
    ]
}

out = "public/lottie/tap.json"
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out,"w") as f:
    json.dump(lottie, f, separators=(',',':'))

size = os.path.getsize(out)
print(f"OK  {out}  ({size:,} bytes)")
