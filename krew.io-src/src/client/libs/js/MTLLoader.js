THREE.MTLLoader = function (a) {
    this.manager = void 0 !== a ? a : THREE.DefaultLoadingManager
};
THREE.MTLLoader.prototype = {
    constructor: THREE.MTLLoader,
    load: function (a, d, f, g) {
        var b = this,
            c = new THREE.FileLoader(this.manager);
        c.setPath(this.path);
        c.load(a, function (e) {
            d(b.parse(e))
        }, f, g)
    },
    setPath: function (a) {
        this.path = a
    },
    setTexturePath: function (a) {
        this.texturePath = a
    },
    setBaseUrl: function (a) {
        console.warn("THREE.MTLLoader: .setBaseUrl() is deprecated. Use .setTexturePath( path ) for texture path or .setPath( path ) for general base path instead.");
        this.setTexturePath(a)
    },
    setCrossOrigin: function (a) {
        this.crossOrigin =
            a
    },
    setMaterialOptions: function (a) {
        this.materialOptions = a
    },
    parse: function (a) {
        var d = a.split("\n"),
            f = {},
            g = /\s+/;
        a = {};
        for (var b = 0; b < d.length; b++) {
            var c = d[b];
            c = c.trim();
            if (0 !== c.length && "#" !== c.charAt(0)) {
                var e = c.indexOf(" "),
                    h = 0 <= e ? c.substring(0, e) : c;
                h = h.toLowerCase();
                c = 0 <= e ? c.substring(e + 1) : "";
                c = c.trim();
                "newmtl" === h ? (f = {
                    name: c
                }, a[c] = f) : f && ("ka" === h || "kd" === h || "ks" === h ? (c = c.split(g, 3), f[h] = [parseFloat(c[0]), parseFloat(c[1]), parseFloat(c[2])]) : f[h] = c)
            }
        }
        d = new THREE.MTLLoader.MaterialCreator(this.texturePath ||
            this.path, this.materialOptions);
        d.setCrossOrigin(this.crossOrigin);
        d.setManager(this.manager);
        d.setMaterials(a);
        return d
    }
};
THREE.MTLLoader.MaterialCreator = function (a, d) {
    this.baseUrl = a || "";
    this.options = d;
    this.materialsInfo = {};
    this.materials = {};
    this.materialsArray = [];
    this.nameLookup = {};
    this.side = this.options && this.options.side ? this.options.side : THREE.FrontSide;
    this.wrap = this.options && this.options.wrap ? this.options.wrap : THREE.RepeatWrapping
};
THREE.MTLLoader.MaterialCreator.prototype = {
    constructor: THREE.MTLLoader.MaterialCreator,
    crossOrigin: "Anonymous",
    setCrossOrigin: function (a) {
        this.crossOrigin = a
    },
    setManager: function (a) {
        this.manager = a
    },
    setMaterials: function (a) {
        this.materialsInfo = this.convert(a);
        this.materials = {};
        this.materialsArray = [];
        this.nameLookup = {}
    },
    convert: function (a) {
        if (!this.options) return a;
        var d = {},
            f;
        for (f in a) {
            var g = a[f],
                b = {};
            d[f] = b;
            for (var c in g) {
                var e = !0,
                    h = g[c],
                    m = c.toLowerCase();
                switch (m) {
                    case "kd":
                    case "ka":
                    case "ks":
                        this.options &&
                            this.options.normalizeRGB && (h = [h[0] / 255, h[1] / 255, h[2] / 255]), this.options && this.options.ignoreZeroRGBs && 0 === h[0] && 0 === h[1] && 0 === h[2] && (e = !1)
                }
                e && (b[m] = h)
            }
        }
        return d
    },
    preload: function () {
        for (var a in this.materialsInfo) this.create(a)
    },
    getIndex: function (a) {
        return this.nameLookup[a]
    },
    getAsArray: function () {
        var a = 0,
            d;
        for (d in this.materialsInfo) this.materialsArray[a] = this.create(d), this.nameLookup[d] = a, a++;
        return this.materialsArray
    },
    create: function (a) {
        void 0 === this.materials[a] && this.createMaterial_(a);
        return this.materials[a]
    },
    createMaterial_: function (a) {
        function d(h, m) {
            if (!b[h]) {
                var n = f.getTextureParams(m, b),
                    k = f,
                    q = k.loadTexture;
                var p = f.baseUrl;
                var l = n.url;
                p = "string" !== typeof l || "" === l ? "" : /^https?:\/\//i.test(l) ? l : p + l;
                k = q.call(k, p);
                k.repeat.copy(n.scale);
                k.offset.copy(n.offset);
                k.wrapS = f.wrap;
                k.wrapT = f.wrap;
                b[h] = k
            }
        }
        var f = this,
            g = this.materialsInfo[a],
            b = {
                name: a,
                side: this.side
            },
            c;
        for (c in g) {
            var e = g[c];
            if ("" !== e) switch (c.toLowerCase()) {
                case "kd":
                    b.color = (new THREE.Color).fromArray(e);
                    break;
                case "ks":
                    b.specular = (new THREE.Color).fromArray(e);
                    break;
                case "map_kd":
                    d("map", e);
                    break;
                case "map_ks":
                    d("specularMap", e);
                    break;
                case "norm":
                    d("normalMap", e);
                    break;
                case "map_bump":
                case "bump":
                    d("bumpMap", e);
                    break;
                case "ns":
                    b.shininess = parseFloat(e);
                    break;
                case "d":
                    e = parseFloat(e);
                    1 > e && (b.opacity = e, b.transparent = !0);
                    break;
                case "tr":
                    e = parseFloat(e), 0 < e && (b.opacity = 1 - e, b.transparent = !0)
            }
        }
        this.materials[a] = new THREE.MeshPhongMaterial(b);
        return this.materials[a]
    },
    getTextureParams: function (a, d) {
        var f = {
                scale: new THREE.Vector2(1, 1),
                offset: new THREE.Vector2(0,
                    0)
            },
            g = a.split(/\s+/);
        var b = g.indexOf("-bm");
        0 <= b && (d.bumpScale = parseFloat(g[b + 1]), g.splice(b, 2));
        b = g.indexOf("-s");
        0 <= b && (f.scale.set(parseFloat(g[b + 1]), parseFloat(g[b + 2])), g.splice(b, 4));
        b = g.indexOf("-o");
        0 <= b && (f.offset.set(parseFloat(g[b + 1]), parseFloat(g[b + 2])), g.splice(b, 4));
        f.url = g.join(" ").trim();
        return f
    },
    loadTexture: function (a, d, f, g, b) {
        var c = THREE.Loader.Handlers.get(a),
            e = void 0 !== this.manager ? this.manager : THREE.DefaultLoadingManager;
        null === c && (c = new THREE.TextureLoader(e));
        c.setCrossOrigin &&
            c.setCrossOrigin(this.crossOrigin);
        a = c.load(a, f, g, b);
        void 0 !== d && (a.mapping = d);
        return a
    }
};