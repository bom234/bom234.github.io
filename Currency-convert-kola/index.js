!function c(u, i, a) {
    function s(t, e) {
        if (!i[t]) {
            if (!u[t]) {
                var r = "function" == typeof require && require;
                if (!e && r)
                    return r(t, !0);
                if (f)
                    return f(t, !0);
                var n = new Error("Cannot find module '" + t + "'");
                throw n.code = "MODULE_NOT_FOUND",
                n
            }
            var o = i[t] = {
                exports: {}
            };
            u[t][0].call(o.exports, function(e) {
                return s(u[t][1][e] || e)
            }, o, o.exports, c, u, i, a)
        }
        return i[t].exports
    }
    for (var f = "function" == typeof require && require, e = 0; e < a.length; e++)
        s(a[e]);
    return s
}({
    1: [function(e, p, t) {
        "use strict";
        !function() {
            function u(r) {
                return new Promise(function(e, t) {
                    r.onsuccess = function() {
                        e(r.result)
                    }
                    ,
                    r.onerror = function() {
                        t(r.error)
                    }
                }
                )
            }
            function c(r, n, o) {
                var c, e = new Promise(function(e, t) {
                    u(c = r[n].apply(r, o)).then(e, t)
                }
                );
                return e.request = c,
                e
            }
            function e(e, r, t) {
                t.forEach(function(t) {
                    Object.defineProperty(e.prototype, t, {
                        get: function() {
                            return this[r][t]
                        },
                        set: function(e) {
                            this[r][t] = e
                        }
                    })
                })
            }
            function t(t, r, n, e) {
                e.forEach(function(e) {
                    e in n.prototype && (t.prototype[e] = function() {
                        return c(this[r], e, arguments)
                    }
                    )
                })
            }
            function r(t, r, n, e) {
                e.forEach(function(e) {
                    e in n.prototype && (t.prototype[e] = function() {
                        return this[r][e].apply(this[r], arguments)
                    }
                    )
                })
            }
            function n(e, n, t, r) {
                r.forEach(function(r) {
                    r in t.prototype && (e.prototype[r] = function() {
                        return e = this[n],
                        (t = c(e, r, arguments)).then(function(e) {
                            if (e)
                                return new i(e,t.request)
                        });
                        var e, t
                    }
                    )
                })
            }
            function o(e) {
                this._index = e
            }
            function i(e, t) {
                this._cursor = e,
                this._request = t
            }
            function a(e) {
                this._store = e
            }
            function s(r) {
                this._tx = r,
                this.complete = new Promise(function(e, t) {
                    r.oncomplete = function() {
                        e()
                    }
                    ,
                    r.onerror = function() {
                        t(r.error)
                    }
                    ,
                    r.onabort = function() {
                        t(r.error)
                    }
                }
                )
            }
            function f(e, t, r) {
                this._db = e,
                this.oldVersion = t,
                this.transaction = new s(r)
            }
            function l(e) {
                this._db = e
            }
            e(o, "_index", ["name", "keyPath", "multiEntry", "unique"]),
            t(o, "_index", IDBIndex, ["get", "getKey", "getAll", "getAllKeys", "count"]),
            n(o, "_index", IDBIndex, ["openCursor", "openKeyCursor"]),
            e(i, "_cursor", ["direction", "key", "primaryKey", "value"]),
            t(i, "_cursor", IDBCursor, ["update", "delete"]),
            ["advance", "continue", "continuePrimaryKey"].forEach(function(r) {
                r in IDBCursor.prototype && (i.prototype[r] = function() {
                    var t = this
                      , e = arguments;
                    return Promise.resolve().then(function() {
                        return t._cursor[r].apply(t._cursor, e),
                        u(t._request).then(function(e) {
                            if (e)
                                return new i(e,t._request)
                        })
                    })
                }
                )
            }),
            a.prototype.createIndex = function() {
                return new o(this._store.createIndex.apply(this._store, arguments))
            }
            ,
            a.prototype.index = function() {
                return new o(this._store.index.apply(this._store, arguments))
            }
            ,
            e(a, "_store", ["name", "keyPath", "indexNames", "autoIncrement"]),
            t(a, "_store", IDBObjectStore, ["put", "add", "delete", "clear", "get", "getAll", "getKey", "getAllKeys", "count"]),
            n(a, "_store", IDBObjectStore, ["openCursor", "openKeyCursor"]),
            r(a, "_store", IDBObjectStore, ["deleteIndex"]),
            s.prototype.objectStore = function() {
                return new a(this._tx.objectStore.apply(this._tx, arguments))
            }
            ,
            e(s, "_tx", ["objectStoreNames", "mode"]),
            r(s, "_tx", IDBTransaction, ["abort"]),
            f.prototype.createObjectStore = function() {
                return new a(this._db.createObjectStore.apply(this._db, arguments))
            }
            ,
            e(f, "_db", ["name", "version", "objectStoreNames"]),
            r(f, "_db", IDBDatabase, ["deleteObjectStore", "close"]),
            l.prototype.transaction = function() {
                return new s(this._db.transaction.apply(this._db, arguments))
            }
            ,
            e(l, "_db", ["name", "version", "objectStoreNames"]),
            r(l, "_db", IDBDatabase, ["close"]),
            ["openCursor", "openKeyCursor"].forEach(function(c) {
                [a, o].forEach(function(e) {
                    c in e.prototype && (e.prototype[c.replace("open", "iterate")] = function() {
                        var e, t = (e = arguments,
                        Array.prototype.slice.call(e)), r = t[t.length - 1], n = this._store || this._index, o = n[c].apply(n, t.slice(0, -1));
                        o.onsuccess = function() {
                            r(o.result)
                        }
                    }
                    )
                })
            }),
            [o, a].forEach(function(e) {
                e.prototype.getAll || (e.prototype.getAll = function(e, r) {
                    var n = this
                      , o = [];
                    return new Promise(function(t) {
                        n.iterateCursor(e, function(e) {
                            e ? (o.push(e.value),
                            void 0 === r || o.length != r ? e.continue() : t(o)) : t(o)
                        })
                    }
                    )
                }
                )
            });
            var d = {
                open: function(e, t, r) {
                    var n = c(indexedDB, "open", [e, t])
                      , o = n.request;
                    return o && (o.onupgradeneeded = function(e) {
                        r && r(new f(o.result,e.oldVersion,o.transaction))
                    }
                    ),
                    n.then(function(e) {
                        return new l(e)
                    })
                },
                delete: function(e) {
                    return c(indexedDB, "deleteDatabase", [e])
                }
            };
            void 0 !== p ? (p.exports = d,
            p.exports.default = p.exports) : self.idb = d
        }()
    }
    , {}],
    2: [function(e, t, r) {
        "use strict";
        var n, o = e("./idb"), d = (n = o) && n.__esModule ? n : {
            default: n
        };
        "serviceWorker"in navigator && navigator.serviceWorker.register("sw.js").then(function() {
            console.log("Service Worker Working Perfectly!")
        }),
        document.addEventListener("DOMContentLoaded", function() {
            var e = document.querySelector("body")
              , t = document.querySelector(".fromCurrency")
              , r = document.querySelector(".toCurrency")
              , n = document.querySelector(".convert")
              , o = document.querySelector("input#original_amount")
              , c = document.querySelector("input#converted_amount");
            function u(e, t) {
                2 !== arguments.length && console.error("enter arguments for node to be created correctly.");
                var r = document.createElement(e);
                return r.innerText = t,
                r
            }
            function i(e) {
                0 !== e.length && void 0 !== e || console.error("Currency array cannot  undefined.");    
                e.map(function(e) {
                    t.appendChild(u("option", e)),
                    r.appendChild(u("option", e))
                })
            }
            function a(e, r) {
                2 !== arguments.length && console.error("enter  arguments query the currency exchange rate.");
                var n = document.querySelector("input#amount").value;
                fetch(e, {
                    cache: "default"
                }).then(function(e) {
                    return e.json()
                }).then(function(e) {
                    var t = Object.values(e);
                    d.default.saveCurrencies(r, t),
                    f.apply(void 0, function(e) {
                        if (Array.isArray(e)) {
                            for (var t = 0, r = Array(e.length); t < e.length; t++)
                                r[t] = e[t];
                            return r
                        }
                        return Array.from(e)
                    }(t).concat([n]))
                }).catch(function(e) {
                    console.error("error occured while trying to get the conversion rate. " + e),
                    d.default.getCurrencies(r).then(function(e) {
                        void 0 !== e && f(e, n)
                    })
                })
            }
            function s() {
                var e, t = document.querySelector(".fromCurrency").value + "_" + document.querySelector(".toCurrency").value;
                a((void 0 === (e = t) && console.error("Please provide a query string to build the API URL."),
                "https://free.currencyconverterapi.com/api/v5/convert?q=" + e + "&compact=ultra"), t)
            }
            function f(e, t) {
                2 !== arguments.length && console.error("enter arguments for the exchange rate to be calculated correctly.");
                var r = t * e;
                o.value = t,
                c.value = r.toFixed(2)
            }
            function l() {
                n.addEventListener("click", s),
                e.addEventListener("keydown", function(e) {
                    return void 0 === (t = e) && console.error("error DomEventlistener key ."),
                    void (13 === t.keyCode && s());
                    var t
                })
            }
            l(),
            fetch("https://free.currencyconverterapi.com/api/v5/currencies", {
                cache: "default"
            }).then(function(e) {
                return e.json()
            }).then(function(e) {
                var t = Object.keys(e.results).sort();
                d.default.saveCurrencyArray("allCurrencies", t),
                i(t)
            }).catch(function(e) {
                console.error("error in list of currencies. " + e),
                d.default.getCurrencies("allCurrencies").then(function(e) {
                    void 0 !== e && i(e)
                })
            })
        })
    }
    , {
        "./idb": 3
    }],
    3: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n, o = function() {
            function n(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(e, t, r) {
                return t && n(e.prototype, t),
                r && n(e, r),
                e
            }
        }(), c = e("idb");
        var u = ((n = c) && n.__esModule ? n : {
            default: n
        }).default.open("currencies", 1, function(e) {
            switch (e.oldVersion) {
            case 0:
                e.createObjectStore("currencies");
                break;
            default:
                console.error("IndexedDB database could not be created.")
            }
        })
          , i = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return o(e, null, [{
                key: "getCurrencies",
                value: function(t) {
                    return u.then(function(e) {
                        if (e)
                            return e.transaction("currencies").objectStore("currencies").get(t)
                    }).catch(function(e) {
                        console.error("error getting data from database", e)
                    })
                }
            }, {
                key: "saveCurrencyArray",
                value: function(t, r) {
                    return u.then(function(e) {
                        e.transaction("currencies", "readwrite").objectStore("currencies").put(r, t)
                    }).catch(function(e) {
                        console.error("error saving data to database", e)
                    })
                }
            }, {
                key: "saveCurrencies",
                value: function(r, n) {
                    return u.then(function(e) {
                        var t = e.transaction("currencies", "readwrite").objectStore("currencies");
                        n.forEach(function(e) {
                            return t.put(e, r)
                        })
                    }).catch(function(e) {
                        console.error("error saving data to database", e)
                    })
                }
            }]),
            e
        }();
        r.default = i
    }
    , {
        idb: 1
    }]
}, {}, [2]);
//# sourceMappingURL=index.js.map







