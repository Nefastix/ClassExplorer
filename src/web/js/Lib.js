var Lib = function () {},
    lib = new Lib();

/**
 * @param {string} url
 * @param {object} data
 * @param {function} callback
 * @private
 */
Lib.prototype.load = function (url, data, callback) {

    var xhr = new XMLHttpRequest();

    xhr.open(data ? "POST" : "GET", url);
    if (typeof callback === "undefined") callback = function () {};

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var res = {};
            try {
                res = JSON.parse(xhr.responseText);
            } catch (e) {
                var text = xhr.responseText.replace(/\\x([0-9a-fA-F]{2})/g, "\\u00$1");
                try {
                    res = JSON.parse(text);
                } catch (e) {
                    try {
                        res = eval(text);
                    } catch (e) {
                        console.error("Unable to parse server response:", text);
                    }
                }
            }
            try {
                return callback(null, res);
            } catch (e) {
                console.error(e, url, "Unable to parse:", { data: xhr.responseText });
                return {};
            }
        } else if (xhr.readyState === 4) {
            callback(xhr.responseText + ", " + xhr.status + ": " + xhr.statusText);
        }
    };

    xhr.send(data ? JSON.stringify(data) : undefined);

};

/**
 * Return number of readable properties in object.
 * @param object
 */
Lib.prototype.countProperties = function (object) {

    var c = 0, p;

    for (p in object) {
        c++;
    }

    return c;

};

/**
 * extObject properties extends baseObject.
 * @param baseObject
 * @param extObject
 */
Lib.prototype.extend = function (baseObject, extObject) {

    var i, newObj = {};

    for (i in baseObject) { if (!baseObject.hasOwnProperty(i)) continue;
        newObj[i] = baseObject[i];
    }

    for (i in extObject) { if (!extObject.hasOwnProperty(i)) continue;
        newObj[i] = extObject[i];
    }

    return newObj;

};

Lib.prototype.isEmptyObject = function (obj) {

    var empty = true;

    for (var i in obj) { if (!obj.hasOwnProperty(i)) continue; empty = false; break; }

    return empty;

};

/**
 * Convert array to associative array.
 * @param {Array} array
 */
Lib.prototype.obj = function (array) {
    var o = {}, p;
    for (p in array) { o[array[p]] = true; }
    return o;
};

/**
 * Make first letter of string uppercase.
 * @param {string} string
 */
Lib.prototype.capitalize = function (string) {
    return string[0].toUpperCase() + string.substr(1);
};

Lib.prototype.keyWords = {
    "break": 0,
    "catch": 0,
    "close": 0,
    "continue": 0,
    "do": 0,
    "d": 0,
    "else": 0,
    "elseif": 0,
    "for": 0,
    "goto": 0,
    "halt": 0,
    "hang": 0,
    "h": 0,
    "if": 0,
    "job": 0,
    "j": 0,
    "kill": 0,
    "k": 0,
    "lock": 0,
    "l": 0,
    "merge": 0,
    "new": 0,
    "open": 0,
    "quit": 0,
    "q": 0,
    "read": 0,
    "r": 0,
    "return": 0,
    "set": 0,
    "s": 0,
    "tcommit": 0,
    "throw": 0,
    "trollback": 0,
    "try": 0,
    "tstart": 0,
    "use": 0,
    "view": 0,
    "while": 0,
    "write": 0,
    "w": 0,
    "xecute": 0,
    "x": 0,
    "zkill": 0,
    "znspace": 0,
    "zn": 0,
    "ztrap": 0,
    "zwrite": 0,
    "zw": 0,
    "zzdump": 0,
    "zzwrite": 0,
    "print": 0,
    "zbreak": 0,
    "zinsert": 0,
    "zload": 0,
    "zprint": 0,
    "zremove": 0,
    "zsave": 0,
    "zzprint": 0,
    "mv": 0,
    "mvcall": 0,
    "mvcrt": 0,
    "mvdim": 0,
    "mvprint": 0,
    "zquit": 0,
    "zsync": 0,
    "ascii": 0
};

Lib.prototype.sqlKeyWords = {
    "SELECT": 0,
    "FROM": 0,
    "WHERE": 0,
    "JOIN": 0,
    "INNER": 0,
    "LEFT": 0,
    "RIGHT": 0,
    "ORDER": 0,
    "BY": 0,
    "SORT": 0
};

/**
 * Highlight Cach?? Object Script code.
 * @param {string} code
 */
Lib.prototype.highlightCOS = function (code) {
    var self = this;
    return this.replaceSpecial(code).replace(/(&[lgtamp]{2,3};)|(\/\/[^\n]*)\n|("[^"]*")|([\$#]{1,3}[a-zA-Z][a-zA-Z0-9]*)|\((%?[a-zA-Z0-9\.]+)\)\.|(%?[a-zA-Z][a-zA-Z0-9]*)\(|([a-zA-Z]+)|(\/\*[^]*?\*\/)|(\^%?[a-zA-Z][a-zA-Z0-9]*)/g, function (part) {
            var i = -1, c;
            [].slice.call(arguments, 1, arguments.length - 2).every(function (e) {
                i++;
                return e === undefined;
            });
            switch (i) {
                case 0: return part; break; // skip some html entities
                case 1: c = "comment"; break;
                case 2: c = "string"; break;
                case 3: c = "vars"; break;
                case 4: c = "names"; break;
                case 5: c = "functions"; break;
                case 6: c = self.keyWords.hasOwnProperty(part.toLowerCase()) ? "keyword" : "word"; break;
                case 7: c = "comment"; break;
                default: c = "other"
            }
            return part.replace(arguments[i+1], function (p) { return "<span class=\"syntax-" + c + "\">" + p + "</span>" });
        });
};

Lib.prototype.replaceSpecial = function (str) {
    return str.replace(/[<>&]/g, function (r) {
        return r === "<" ? "&lt;" : r === ">" ? "&gt;" : "&amp;";
    });
};

/**
 * Highlight SQL code.
 * @param {string} code
 */
Lib.prototype.highlightSQL = function (code) {
    var self = this;
    return this.replaceSpecial(code).replace(/(&[lgtamp]{2,3};)|([a-zA-Z]+)/gi, function (part, a, kw) {
        var i = -1, c;
        [].slice.call(arguments, 1, arguments.length - 2).every(function (e) {
            i++;
            return e === undefined;
        });
        switch (i) {
            case 0: return part; break;
            case 1: c = self.sqlKeyWords.hasOwnProperty(kw.toUpperCase()) ? "keyword" : "word"; break;
            default: c = "word"
        }
        return part.replace(arguments[i+1], function (p) { return "<span class=\"syntax-" + c + "\">" + p + "</span>" });
    });
};

/**
 * Highlight XML code.
 * @param {string} code
 */
Lib.prototype.highlightXML = function (code) {

    var replaceSpecial = this.replaceSpecial,
        level = 0,
        regex = new RegExp("<!\\[CDATA\\[([^]*?)]]" // this line break is done to avoid xData
            // injection fail, as CDATA cannot have the closing character sequence inside.
            // DO NOT join these three characters in one inline string
            // KEEP THIS LINE
            + [].join("")
            + ">|<(\\/?)[\\w](?:.*(?=\\/>)|.*(?=>))(\\/?)>|(<!--[^]*?-->)"
            + "|(<\\?[^]*?\\?>)|(<[^]*?>)", "g");

    function stringFill (n) {
        return new Array(n + 1).join("  ")
    }

    return code.replace(regex, function (part, cData, tagS, tagG, comment, special, etc) {
        return typeof tagS !== "undefined" ? part.replace(/<\/?([^\s]+)(.*(?=\/>)|.*(?=>))\/?>/ig, function (p, tagName, attrs) {
            if (tagS) level--;
            var s = stringFill(level) + " &lt;" + tagS + "<span class=\"syntax-keyword\">"
                + tagName + "</span>"
                + attrs.replace(/(\s*[^=]+)=(\s*(?:'[^']*'|"[^"]*"))/g, function (part, a, b) {
                    return "<span class=\"syntax-names\">" + a
                        + "</span>=<span class=\"syntax-string\">" + b + "</span>";
                })
                + tagG + "&gt;";
            if (!tagS && !tagG) level++;
            return s;
        }) : comment ? "<span class=\"syntax-comment\">" + replaceSpecial(comment) + "</span>"
           : special ? replaceSpecial(special)
           : etc ? replaceSpecial(etc)
                : "<span class=\"syntax-other\">&lt;![CDATA[</span>"
                    + replaceSpecial(cData) + "<span class=\"syntax-other\">]]&gt;</span>";
    });

};

Lib.prototype.getSelection = function () {
    var html = "";
    if (typeof window.getSelection !== "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection !== "undefined") {
        if (document.selection.type === "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
};

/**
 * Contains graphic base64s for the application.
 * 16x16 px
 */
Lib.prototype.image = {
    chip: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK3RFWHRDcmVhdGlvbiBUaW1lAE1pIDE3IERleiAyMDAzIDIyOjM1OjIxICswMTAw2q8EHwAAAAd0SU1FB9MCGRcbLxQhzGIAAAAJcEhZcwAACvAAAArwAUKsNJgAAAAEZ0FNQQAAsY8L/GEFAAACEklEQVR42sWTz6sSURTHj/gjFUVdDAQOhDhgDwRJSXHjSoRCc+XORbt2blpUu/6A1iHu4tFGcCUVvtVDIfwBpk6rRJ/ib1MZdfytM5070KMieC0edGDuDHfu53y/59x7Af53yG74L49GowxFUa9ms9kVz/PpVCr1BefFGxM4HA6j1Wq9YBjmIU3TgDAMh0NxMpn0RqPRh8Vi8bJUKnGKv8HhcPipwWB44XK57isUCkB12Gw2oFQqZXK5nMYEz47H4xtcysl/Bb1e712n0xlF5YTP56MOhwMsl0vYbrdAvsfjMbAsC7FYDERRPKtUKufXDvx+v9VoNF4GAgHaZDLBdDqF9XotgbiY2IdCoQCozFssFgHtW6UmkSESicTtdvu7YDBoUKlUMJ/PJcv7/R5OpxO0220ol8uQSCRAr9efisXiVbVafd7tduuSA5vNFgmFQrJOpyNZJiBRFgQBms2mBK9Wq0OtVuvjm4rH4w8QOxFWSqDT6Q5ESaPRAMdxsNvtJLjRaEA+n4dkMgmoqEin0yzuwtuf8HUJ2LTHZrPZQqyTUKvVEliv10lSEbfsG4KaXC7nQ/vsbweFDFjXe2zQEpvl1Wq1dxCAbDYLaJWUJ8tkMh97vd5rTMrCHyElaLVaAj6fsb7zfr9/D/f6DNV5dPQV5/So/AQFKv98lD0ezyPsw9ztdjODweA71v7pdm/QbcYPCZIkO9gEQq4AAAAASUVORK5CYII=",
    moleculeCube: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAE1pIDUgTXJ6IDIwMDMgMjM6MzY6MDEgKzAxMDC/PwNMAAAAB3RJTUUH0wMFFxI6j5FSVwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAAKtSURBVHjaY2CgBvjPwMB4WYlB4z0DAxuKuDFD0Tc3nndnGBnyUMSFGPhgbEYQ8cWBbSmXmlDUtYUvLq1o6p7PzsSo9eTzD61r1y6abPyznT2c2fezrrrShl+MrMcnH23w+yci5H56x7seiy8MZWAD3llyvHsrJyDYzRfEwMjK9OPdzStrS54f8GD7xMB3/TnDv238Yh3v7G2ctTW0rHnf32Ks/bmT4dDGjx/s3zEIMoMM8H355/uvW18czt++s+2HhfWjgrcX/c0iRXkkuP8xv3jGyPKmtsVOnIPt482Hj5ZqL1/+X+ruT9k77xkWrmRg2Ar3V82ESetd/PzDQOw30gyL/gdy//9vwfB/HzPDZ2ldfQmYusSMTLekqJhDMD4LjMHx5dMTATZWaRD79XOGpjPbvpr8/M0gvdPd//fT7RtfwNQJ8/HyfmT4/xbGZ4Ixfv/+/ZSbh0cKxNb8x3BnS31H39bwsF9aauzcL5kY0mHquDg4eNmYmT9iGPDsx7+nf5hYFEHsgKBgvl+PHmh9ZGYXyX66iaPTzaMmOD5eG2wRBw/vby4euAGM0HTA9DFQ5PxdFgHdm+d/n9ni6C7N9uf3bUYmFs3EubNX95mY3RUwMUlSZfp93+/TWZVTLxgYJfecs/diYHgFdsFjSQZO9pcfND+zcjNeUlQVOH3ihAYLG3szhwD/dzsGhpwNZ071X71y2ZDlxoV/IhJ/NZN+nNO4zcDgAw9EuecMX08+/xP3+thFt+dFxYo+Ztz72K+fXXyPXYf/AieDfF9akZ2qqFD5kz8Mf07O6bsp+ZrhrxgDw05cKZs5JiS073+40P99edb/D4sy/A0pKL7i6OoaAvMy4bwhwWD43x2YDgI5/18RYfi7nYFBkNT8xXiIi2Hebn6Gt8DU1kSqZpIAAN9VByIMFaPkAAAAAElFTkSuQmCC",
    blueFlag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAERpIDIgU2VwIDIwMDMgMTY6NTA6MjkgKzAxMDBpQ0TdAAAAB3RJTUUH0wkCDjMC75xHzQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAAHsSURBVHjapZK9ixNBGMafmd3b2b3NRTkwhHQiioWN2Nh5EBBEK4v7E8S/wN7CztomZ6EI2ggpDrFQOdHCRmxEEIsU5mMje0luZ7+zM+vsekkOc2Dk3mLZXd7n9z7vMwOcsMjspdVq3dcouTvwxPru8NyrX9XLbZKmXpYmpibErY11cp1HssryKZ+4B1/6j6/eLHT6DFCv1+9sbV2r7bZf4oLIty9drG7/HCYY7udIUh/d2MKZeg03rhiVt+3PZv9QR2eAIAicKIqxPxpD8hE2N3QI04YTAt+6PjTlVeYSIgP4xPfwN8D3fUfXdZimhSwOIaT6masdSdFEFjsrReBFywAp5UAIAWYyyGmETBwfGlUKb+wtA9R0J45jMGYBWaSsysVU8udBC7VyFXp8DtAXTaQEGIYBKlOIaQ6qFcdEyrEiCNSaIXqbNahUD44FJEmiMmDIVVLdPkco15CFAehonE8Gox13mj198T48C9hflwBq8qB0wEywtIsPzx8+c83mGyIimRPtR7Z3+9Nh68ejmcwBKsDSwZrBUGEU58W7773XD5786ybOQ2w0GkUGeZFB4QIaO73KVZ4Dms0mVycRlIAiSEpP/RegqDRNHdu2VZAmNE2rrALQj364rrvT6XTucc57lmU9WgVw4voNC4zd70vBO2kAAAAASUVORK5CYII=",
    ghost: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAERvIDYgTXJ6IDIwMDMgMjM6NTk6MTcgKzAxMDCMVVlHAAAAB3RJTUUH0wMGFxkwngXNbAAAAAlwSFlzAAAK8AAACvABQqw0mAAAAARnQU1BAACxjwv8YQUAAAJkSURBVHjapVNNTxNRFL3TTvno9EuqmNZpymihWKhNkBrTLtQ0Gt1IYsqiEohrkiYuYOEPkISlEFmQuGqicclC2RAjLthha2hjMBSaJii0NLRTnDLTmY53pqGpKaKJL3l5d97cc+45790H8J+DOG1zdnbtXqm0P03T5us8L1RTqewnvd7wfG7uceKvjAsLX5+urqZrctOQJFmen//AR6Nvw2eCY7Hs1ZWV7SrHSQ1wPJ5W1xpSzsy8/zk5+cbVjNE0f+zt7T9hGDPp9wdgfT0BiUQWxscjsLj4GqpVgHD4vp5lD5/9kcBi6QhkMt/A5wtALleGjY0kDA/fht3dQ5BlAJOJAJq2PEKjmlMJurp0vTpdGzCMFxMZBBjB4ehTp6JAkpQiVsvEhNzTQjA29rlNFNnzPl8vJtHg9dLg93uAoi7A4OA1qFTqBAaDCeMKfYIjT4Lu7i1be/tlrVJ1auquume3WyESCYHRSAHLAoiiQmAEnuftLQpEUTtgs1kadvJ5Qa1qMFDqWqlICASwWs/B8XGVaVHAsqXQ0JBTjRWpxaIIJNmmgpQpCDKeg4xKL+J/0dtCYLebH5IkCRwHOCWsKKuVBaFOoCjAXgCdjsRcW/A3C6OjLz14aFeUq9JqASVqMbGjcfIEUfev0RBIUsMbsjmCwehAQ4Ek/bhkwkuOxw9gaekjZLM5cLl6YGTkARQKZWyqL5DJbIPb7YZA4Cb09/cRy8vv7iA0pT4mj+eVjqY3XxQKRyGK6tSixy1JktbQUid2cblUKt5yOpkbOztplqKo7wRBbHLc0XQyGcv/05M9a/wC59cUbcvinwEAAAAASUVORK5CYII=",
    moleculeCubeCross: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAE1pIDUgTXJ6IDIwMDMgMjM6MzY6MDEgKzAxMDC/PwNMAAAAB3RJTUUH0wMFFx0vZdSqcwAAAAlwSFlzAAAK8AAACvABQqw0mAAAAARnQU1BAACxjwv8YQUAAALsSURBVHjarVNrSJNhGH2+75vfvuY25/IuKs50UxNBrbwMFbwWqWnQxQwvf0qICBHth4JJZaWE6C+pDAuxKLFBzcRQ0ywrLbw3W1hqbl72remmm5t7c9YEu/zz/Hg5z+Fw4Dy8D8BOAAFgwwIQqQHIbXooFKwksul+DM5v0/nAtXLM8mhjyUaWHz9zrEE59KC88i4TxwJmlvUBY2ODYRJTK/M4kbIcJBQ8WcNs3tT2lqWaHfhJ75/TVeFaKNoMoCMoWuXJs6/kZgBmg+tp2UhzoaIrmVwC7rgCzFI7p2t0jDguUBQQxVFPYKWGNuiWaH7E0GBPWAJS5kyraxPa2I+f5VJ9eNTUBdVg2v6TjmwXWzOhnMUYi6WXo50pUiP7NtUY2NSE3L4YPORqaHgI8GyrV0l1TUt8atoxC190h3so3RahcEAdBCy7BwW7WH25Z/MT8zKzuq0zw0oo7dIMj7Rxt/AFBZT3S3VhBiO4tyWlGb+3SpRW324uh6MBpLLOuJUIhUI4kp4uRgid9jeDvKOiumaprg6PFHuz53A4Y/WxKIpDEoTmrwC34VEvqrQ0boM6TfX1ZRyoulHhqV9jnxK5MK8nJpcczc4OtPiMFJtjZLG3ArDf/wDvdmQZo08E460jJK1WKO0yExiE9KnW7COOllwcl/XwwsLyfHHjZOrSwJ53SsBcX3yIOQQwv7mDaVfYtahZxYBHgnBdzhdEcKFHMmU0XKrViXJzMiyefRSz1p/UP3YIWffP+zoINQCHN+T6zQBPBegGi4s6uhrr4mLjPUA3rYYFQYhMx3Pwma+uEhdOznr7OvKLZ0xgenv7psx1AdadANq2KrwCyMEEdrciEzwYsGIAMBuhs2sevK5cBVuChc4NyMZUo0Nlne3tzb8a/4FmAh9GBXvRSKiD+aWIr0apzghlOaLXfq6IbqxfbwWw/98dbVZwwkHecueTr1Zjyp8EuK+agF6KgfkxmQgbb5E+Ogig3pGr/Rd+Ai1UJxH01MR4AAAAAElFTkSuQmCC",
    greenPill: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK3RFWHRDcmVhdGlvbiBUaW1lAE1pIDE3IFNlcCAyMDAzIDIzOjI5OjEwICswMTAwQo74agAAAAd0SU1FB9MJERUdI/ot6l8AAAAJcEhZcwAACvAAAArwAUKsNJgAAAAEZ0FNQQAAsY8L/GEFAAACa0lEQVR42qWTT0hUQRzHv+/Ne+7uc3dphVSMjYoWsbA/h6g8iNWtKCjqoEmXugoh0aFDHkICLx2ELh0khAjKCIsKPGSY7FL+QYvIlCKSfM99m2/dt7O7789Ms4fCUknoC78fM8x8P/zmNzPAf0r6NejpGW4Nh8m1aLQybhjWhCSFbnR2Hn65IUpX1/P2oaE55vucU8p5Nsv54OBHv7d3/OqGAN3dz97rOucLus/TJue6ISAW5+Mpi9++NXnnSscTdT2vXE7BoBpPmzlYVgk0z6CIg9kFhtfBPqQSNy99PdT34uzEsdi6AF3PTGcyJuycDbfEMW1+wIm3ccwGBrDjgI14k3V00ZxLNifrd64J8H3SPT72iS0t/YCeNtA6eRAtiW2IqVVw86JCSUVzw+56vuykGodrW1YCSDklkw/m9u87J0jekae5fpDIDKJyCAWfig0EnIsl5iFRW6MZeq5NviB9s/oLU78BZY2O3n/V2HAmMZwf2BMN5eA7HMxjKHmOADARHI7noi4UIxmTnqSnvWTxoftZWVmOprkX82Zhu15Bm5woR6DSRSisoBhxEKxUQQgRRQK7gtXknbFwXViGpL+bgstaTSDnvamvjW1VNVkYFWgRBRUBAlmRQSRJhIIRY7642JENrQaU1Ya9GgIjW6rDETUooSJIoKjlEAAi5jLBxPJiOttFq5U1AfcwRU95rd+p/XhTTFWIMKtlsypBJTKYuLssLT36o4mrNMNn/TpuOjY7zhmTPMrgFrl4aD7mLXtWvPvzmAJdHyDEv/AxvllKFbN+vFRgVdT20suF0l3msnYMILOhf/Iv/QS2OyBbr28yxQAAAABJRU5ErkJggg==",
    iceCube: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK3RFWHRDcmVhdGlvbiBUaW1lAE1pIDE5IEZlYiAyMDAzIDAwOjU2OjEzICswMTAwhV8lEQAAAAd0SU1FB9MCEwAKIKGTp3IAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAEZ0FNQQAAsY8L/GEFAAACoUlEQVR42qWTz08TQRTHvzOz3W63lLbQWixIBRU08QdcTAwxil5M0IPRuwfiP6DGq3f9B4gXPegBLx5M8KAnY6JEQtB4QIOGIhhagVbLtrvbnRnfQqwYj0wyO28y8z7v+97bAXY52B/jflHnN1cwmmlTp3tTOKYYhp+t+7FAonIiLsp5Q5RW6qpc9VQpcLDka/Xkzmhs0Qidn6/qiZEOXE/0hkCOL75kjUDjYlwgE2Xp/ZZIL3vBoPA1phZcJHMMqXU2Tq6DW4DFqjduWIxlOUefLdgBUwAmHdjb6r65Cg+Xm/hck+i2GYpNhbhgA+HZFsBpKuNVRUNoYI/JMUSR10lBv8UxYJNNDnsthqH2CGZ+BogEgFQqaAF8qd2UgCU0A91DmRzmHYVKU2ODQO8dCUnwGtkWZ6BM4PjaDX15+FFSNxlZFbogaA2nRVkE0ARRsGmfpD35ImcyXMpGoQLdaAGSgjlRxhAnPZzoaYPjYIzjsG0gFxXYR1NTfbvMcAUelzw0KGgLUHVlszdmoDvKsY/yXqGiFT1FTVYhHHWp4ChKx1eULnCh0wQ14q8CLbUf5jhdlTiTNuFpjdlfElNrATJU1KKrcZzkHU0IMLo3U6PgSnmtIkakdgiDBO0mSR51EgUqgmRhXRTaKP+iJ0kBwxtqZZ3OI9D1FmDVDZwRkl+mqrsU7VrBwpXstrMkNcNEThoM7TQ3qde9dgR331amW4D5jdqLl5/MU1cLMRzp5PhI0fIRvtW6bIT+xgjw9AcpI1XLJY5Hc8Hk7Dtxe8db0Ozkg9pYLpoYM7k639FeP9TfI5BKM1zusTCzGaDkSizMBY3JD/aNrzf5xH+PaefI3FrqFqo2moqZ5zq7omfzKaNv9bs7+3pNjONeYW63L/if8Rs4lyRrD9xpXAAAAABJRU5ErkJggg==",
    minus: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABNElEQVR42u2SsUoDQRCG/73EEBMPLCwkhahgI1j6BHYiFvoUFhZB8OmsBMEHCAGxEImEgImBvYu5y+3u+O/tRQtLCy08mJu5ufn+mZs9hR9e6l8ASk7O+tjttDEvvsuJoy37uOCsvzHZqAOD0UzJdVdwegiMXoGVGusiLxuKvBnPWnoKOFpBs0y2WHf7AGUvL3R0tBdjMCRI9VkKTMdAohlngE4IETD2C84Zk3dPOlHzq27SPFhfw/0d8ObBNHQrbAC9N0ur8pkrm+kXnSp9fqzjHROj9wg0V1kgFVxB3lsCWTVBXn2GEYwn74nqbW/K1v4GzHBCVe7AFOVLERvE2FWMfEI+FiuIONzzIoe6aTT6nVa9nWcLTqUIlmdT+mBV7BfqFCwfHGqIuNgpt/QHfqRfF/gAIz+4k570HlcAAAAASUVORK5CYII=",
    plus: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAABh0lEQVQ4y52SPUtcURCGn3Pu2V3ZpAhaLAQtQiwDVrGSoK1dKlvxP1j6D2wFK6ukCf6DkCJoE6IogWCzoiFgsHDDsnv3494zMykuCYl774KZ7hzeeZh35nWU1MrBorUWZgj1GgAxy7n9PuJ4q+3ua0MZYJBlbLxc52vnDQDd1HN12SyTlgMAUEfNNwBIrFJVDYjqEAVRSMf+4QBUyMVjQJQpE6wcLJYOmOWOYe5QgywXuv0hz3dnJ7ShRoOt188w54laNGgeOL97BxpQPM3HjlerCS9ay6gVtlTg8P0JIRspX24/46ghAgpE9ajWEQNVEPOYwfnNKfwGAN1enyBixOjwDnIFU080MEDEIUCMxVsNogIGikcihJgZ7euk+AWg2NhSa41veoQa/LiJADyq37vUWAnpYMzZx39383PQYWmTP5YAPn24K7/Cxc71RDznt5/ak+Yc444HBHGFJN0bTWgrE5KLYSaIJZhSWZVBEgPRBKWw8mDA3+fS/5lg/+0hvaxbAKZk+ReMaMs7XA7SqAAAAABJRU5ErkJggg==",
    crystalBall: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK3RFWHRDcmVhdGlvbiBUaW1lAEZyIDE5IERleiAyMDAzIDIwOjIzOjM3ICswMTAwgTNEtwAAAAd0SU1FB9MCGRcHLoVRoakAAAAJcEhZcwAACvAAAArwAUKsNJgAAAAEZ0FNQQAAsY8L/GEFAAACeUlEQVR42qWTy08TURTGv3m3nSm2lVcLKYkkGIVA3MhSNsQtK6uJG1m4UBJZ+l8YdhhYYKJ148ZHWBlcGYm60EIGfPAoFZBiQYZ2Ou/xzERMGogbTnJzMnfu+d3vPC5wSmNO2nw4Odmpadqdqq4PeUCSBTYlQXiVTqenbo2O1v4LeJrP51ZKpenW9nalv7cXqWQSW9vbWFBV7O/srJ9NJkfujo19PhEwPTU1XDk8nO0fGOA702lIkQgYhoFt2zAMAyvFItRCoZyQ5Uv3xse3ghjuKPjRzAz7s1KZzXZ3t6QSCZB0OK4L23FgWBbqBBF4Hg7DyHvlcurN3NzzII49ApRKpUFelnsYloXj++FyAwh5n1T45C3PAycIYCXp2vVcTgzi+COAUa/3tTU3Q6ebtioVRGIxSJIU5uhRYJCCYZpgCRCJx2We58/Rr+V/gFqt5kVkGTwdEChQEEXQIQSKfAIwf/ddSknb3w8u9BoUkBVMXUc8kwkhUjQKjiAsAQIFLtXBrNdBuaCmaYeqqq411ODBxMTHzfXiokJtC+UTQInHoTQ1hV4idVFFQYy+vy8uPlaXl+2GLgTmJ1oKQmv6ZldvHxcAAlA0JofyQWq4RAr5J/nS23fzN3Y3ivqxCfSz6CtexOqH+7f9+aUl/xOV/gutAq15VfWfjQz7L1i8XgWyxwbJvwwRHdk1dGUzKK7D+foD1V+AGXSoAliUrEGN26UIxcG3wTp6Gov4Hr511dwTLSeDM0nw5xkk0gdAVYPVBpTpBehUQ5M852L3xFF2OxFd85Dz4uKQyHMX4LodjmmLVcuvHujY+G1hoWZj7oqFlx00Y6d9yaH9AfjUFDAtnmCxAAAAAElFTkSuQmCC",
    user: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACyUlEQVR42nWTa0hTYRjH/+dsZze10i5j81JhLqOijBSVqcSIjKLAvGSB0Lf1QcxSJCFDoRsUZQT5IVJKIx2VlWIfSsxrWSrzEpmXWro5LzHNy25n5/Ruo0Jx5/By4Ln8nuf98z8UVnmURW0lieFrsxUbZLLZBTv/YXSubO6386LpWoJ1ZS21MhBR0v62NGuXJiYsADMOQEAqBqdtKNb1D09NLqkM15N4n4CNeU3qolRVS0q0Am0GG2iaB0XKQ9dLoTdYUFzZlz1+I+meT0Dwhcb7rwvjteMLFFjeBZpk3eNEZA2BiEbJI31re15Mgk/AzsvNt17kq89/NFvhJwAYigZPKliew6ZACa5U9JgbcvYrfAMuNd2uzVef65y0w8HxsDg42Fw82YKDzF+Mmmd6c0dBnG9AiLb+bmlBYvanXxzsDue/tFgkxKLDhYbnPfXDNzVHfQJCtXXyrSq5OUq9DbyN9STdIooDGHzRm9DdNnTY+OD4G58A/9SaCKXC71t6WhSmeAa80wWKKEkREd+/0mPWbDlrrkovWxUQeFp35mDc5ofHkrdjYJrFiMUGxt1MXgFNg5EIMdo3jqHPI9Vj5SknlwGCMnTRB+LDOjNT96KyawZLZLKMob1XgNc3AqEA0gApxgaMGGweuGN6kpHrAQSeepq8Ria6WpiniarutQAcBzEt8DRx1P8VvV8e0nV+GHzXh9mxSY2xKrORitS+rIuN3XKEDZGj3zAPf5G7i1p2RwpeQ7kVFTIi2GcXYWzvbzVUpCVQe3LqepMO7djdOs/AOW8FjZVT/1Joj6BuPWg/Ccx1HROG8hNKskFtl1Il3/dTEghifkAmIYM4z0yKmMkTcx8n6z02B7gFK6xfv5uMj9ODKXlqZRBrc6pEUnEuJWUiIRGFw8WSXcXEAESLJfIH0wIhHOwEWNcwZ3d0k1gLLRMPmHRZP/4A67cYINx3gGMAAAAASUVORK5CYII=",
    redFlag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAERpIDIgU2VwIDIwMDMgMTY6MDk6MzEgKzAxMDAbRI2sAAAAB3RJTUUH0wkCDgsfmwWX7wAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAAHnSURBVHjapZK/axRBFMe/s79md0nOhEQtvErwBwhik0JBTCGW1hZXpdFWFCz9G4QUV9gasBBFEJU0R2wMKFhYCBIPlLvb3MU79/b2bn/c7Ph2wy4LZ+AkDx4MM/P9zHvfecAxg+WLer3+iKnq3bj90z71/tmbW60fWx7DKI5gCRW31TOVm4lIFgKB4bDtf7zmyHupTssB1Wr1/o319dOv3m5jde/1hn39/IYSAPK3D1syaPYUuLgCrF3Ap4c7q3AOMp2SA3zf70zGY3T3HfTCBPq5BSxeOYHKSQXaXgeYSiCiDKbw++Ew1xUVeJ7naJoG2+QYC9qO6bJMgKTc6OHaG8UFQCkdOUIImJxjIg0CCLpcVuYKhskgcGcAjLFOEAQwdAMTZiBJSy4/m7LUQ4UbYrYFRVGcFGBSC5HKIQUBNFKplDrDn0GMwRcXy1YfEY4AhGGYAWLJ4X53oQcSSS9Erz2Vn3f6T8mOF9FW6+wSsDsDoMha4IaONl/B5kv/+dWDXw1iCF3FtzvAh38NUgGgH8gq4LoOVlnEu0uXvz5uNOrZoTh6EgsTpZQpQBqGAZOSA0vzjHIBqNVqHlUxMk0TnL6SPPk/QBrkwb5lWRmAYPY8gLKJ6Ha7m81m84Hrui2CPJkHcOz4C2fdx/hnBd3YAAAAAElFTkSuQmCC",
    table: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADC0lEQVR42p2TS2wbRRyHv5ldr2Nnk9ixHbe0QC2BWoGQONGQFAgPicIBBBQkhBAHHleoQNw4cCwPcUOoQryCUtkkbSJLEVCVtiBRDkUUFQmaCrUQKCJOG7vrR7Pr3eHvdaB3ZrWa3dndb/6/b2bVgem5x7bvKL0WhcoYei1ERR5GD8u15mpryZn6b2wgYamfz5x/V3339Q/GLx3F+Hb8QAnAxD3SXwUo+vh/xxKJiM6p24gBh7c+zfLqGknLkjcd0omXaAdvYozamNEn6dyPH3wvYzW5TxIOtNjz66E+oJx7jp9qNVK2IqEHyVovshrs25hNyREwrHfT5iTr0Qra9AAd9v5ViQHezl23un4dHElRW4cTDXhoDLpRv3xbONUVGM9AIQlBKBFG4KvqiaY6duSYN7lrwq3XG3EFNV/xbV3x8FiEvwFw5JyvaSYyhoJj6HQNuVyG6sIXTXX8yyPexJ3jrtfwGBDAhY7hm1WLx7eErJvYmsSCuT80k3nD5pShFRhGs8NUD34eA8xbzRvQgU8maaG15lJgcVOuJ9AmJV7TjsWyb3G9rOKQROi5HcpmcY4fRC3OL3rjd427l+uXxb7mz7biqFTw1LVdrkT9CpKWYWbZYqoQco1AWuIpl8+wMFttqrnKgnfHPZPu2lodtwfoKBb/tnl+m087VLGDtADeP+/wQLHLFonQlAiF/Ciz5fmmOlwue/c9OOU2LtUZSsBZT1OW2V7ZHnBFbEdSRVI4+85Y7BEvJTeiIXKKYzk++agSA8z04E7CdpvRZIIuFr91NLcX5Utti0DNoMg97dncnDWMDMheFWo2n2e1/B7q4w9mvIm7JcLFNYYdzbm2pnLB5tUbfdYlglGKlDa8cTbBE1tDtqWjOEI+n+OzmVnUgU8rzXt3Tw1elK08IoBfmrD/nM3btwR9B1JIOmF4+bTNC6WQHS7UexE25flw/3QMMPlNBeo9iXEFFodWUuy9rtlfhd6fJ/vgnd9dHhnrUEqHtHzIjI5w6uSPqGeefPbR4ubiHP+jLS0tvf4PKUZIoAyrwMEAAAAASUVORK5CYII=",
    earth: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADUklEQVR42l1TW2hcVRRd5z7mcedOXtMmmmknpg+VZEIFrfjT0lZqQiemoWXyVxpRKNUKiiD4WUHBHxE/IvVnIuhHDLYiHUhKBEmxUEgKLbEW0kkyebSTmWle87iPmXNOd6a0VA9cOHeffdZae+19GP63XhvJRPv3+o7uCWrfpwq8Fmv1K9nLc9Z52q6Mv9t88/l89nTTl3xoRuu8o2c6zZ5XG3XMbEmoUiBTYQiqQJ0qIewqfpwpjV1btuP/nA0XnwHsHpo3hmPNd49FjLYncBILRYG/1wUadAZbAJ1eib1eQFckvr1dTA/dLnakzreVawBfT+bHvjgU6oYQ4IJhyRJYcoANV0JTUAOI+gQaCditAi8YDBcm18Z/iL3Yw966dP/E5GAkqasqbC5xqyCRLgMGyfbQ5W0XHIq/bW5flnhUAXboQNaqYuDKgxiL/7KQGBnYPVhwBR4Qa5GSc5yhIiSYBAr0f8CgMjU6q5AUijsViRZi+Pyv7DA7+/vKavxIa7NacvB6QAEn1iVL4l8bZJ7EJjEerWeIEECOSCy6XKlyAtDx5Y18ll2YyFj7XtnhS226eCeooHcnQ4kUTG8J3CmJWhkGYwiRebvI0CZNoEqlSIXh3J+PbPbRtYzVvj/kW1x30ElS39/lwQaxBFUFc6UKvlpwoZKsnM1xsEHBh2EdnHMk8hI/3czZrC8xu3roWHvzUq6MAnXg47CKiF9BPQEkcy4SaRemyqgjHFFTxaftHpRdIA0F312dz7I3Lk4ljg90Da5tOMg7EsdDCs616ZgvS3w2U4ZDbdMgYJMXglxNvmlgalPgt1WOGxOzwyz8wcSJw/3RpNkSxPKahfciHsRbPTgzVUKqUEUd1epKCU51bzoC3a0apksKpu+tIXAvHasN0v5PJse6Th7ozhPNNy97cT3HcSllIexntZZVxZMZEFR7lvxgNOKBW3Pj80NHemoALfE/jEC48W7T4Y622EseLOcsXM848NGpS3NQ3f6oEy7TwGkU1TtzaW2r2LH4c2/52WMK9Y+aeoM56u3a06O31INrKoRbqTFzejKc5CO/Dn12cUx17PjKyOnif17j09XU92uv2micQtCMSb8/IEguLKukbFlJpVi+nL0Sv/p8/mODDJQs66BSJwAAAABJRU5ErkJggg==",
    zed: "data:image/png;base64,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",
    eye: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC7UlEQVR42qWTS0iUURTH//eb8ROdZ5o46qRktHBSFCzJlfRCKNqULXoZtOgdZSY9rIULIYLIHliQRBmIUBCREkSlUSBZmjROqTHj6ExOJqYzozPf896uBhLhqg5c7uHA73A4//8h+M8gfxc0z+FiaGotFKmEKbLOJAmQNQNkqZvNxuoT97zrWbSB+rXaTqh2jcOVoCoEXYMuxyFIcbDZOMAf5c1YTGqmCjuRdLx/eqGB6q3JIWBug4FaWDwG6veBBoMgPGdUBwQRMJkhGBJAZAWKokd5ucB00jNCOCwYjEKQGGnGdFcPIq86QFkyaGY+qCUdRjEJiIyBTAzAODMBU2Y2rGl2yCoN6Tp1EjZ2/iRi0as9Nx/wUZMhl5+FVlAG1bYKUDgbnUWK0wrDzyHonz/A3HkZxvHPWOlygoqWKqK69wbeNT5zOjacQeb20+ic4RMzIF/lydQ4Ghtv4FsM2FzXADERcGkM0Te3IbfXoWAZCRLv/R1S6rpLibZluRjmzGBUw2RgFNG3D9Hd14+WR48gxyWUVd9C3q6DWKMFsHm5HSP+ISQ9PSqTKb9Hsue4EueW2T8ex70gw3DvJ7w4UIrIH3IVHrkJ+9b92CIGsNMRw5gtD/G+JzLxNRYFzGVNzjRXMSb4wiueBJGdkoLnx8rxw/N2HjZbUrG6yQNfRMadUhFOsxGh94/heHMhSFjP9lPu1o4reu5uFFUcQk3IhdYvDOlWgh9tzYiHw0jeuA+jmhVltnHczeqFt70BjlAnslc4q4j+eptBIFrA/7IrIxySgdz1uDebB68lH35bITRK4JjqQ2G4C3tENxK+f0SyKGBpdlZImZNxbkS5bVOOyHS3PDllkXwBcOWhQ+A2I7+dRhgSqIYZaoRuWgIiGKOyohVkXBwcWbCy0rLWLkjqNaaqlZRLxSgF4zvhHzcWm/9VyuuMNXMXnkivHZhe9Jik665iSkktZ0o0ynTOzHUwaBTdnK5POzew+DH9a/wCg6d3xpUf4V0AAAAASUVORK5CYII=",
    binoculars: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADrElEQVR42m2Sa0zTVxiHfwfaSgthCxTEuZlMdkn2wW26utlEwtQB2rUUicSJ4gRS7cBNXIlmSGCbcYuGbMsYirawoWSJyEAm09VOII6tYKmOS8cYtEBrL7b0Tiv08t9/zZa4ZOfDSc553/Pk5Pe8BI+s3cUljrzc3FSj6T41NjZOLn/bRv6+31tSSvH5m6hJ3e9kfFLnuaW88fi/b8ijgLJy6ZL8QhPL4fSjq7sLkrKSWL29/TK1Z88uWBxeHJO9//DiN3L2/wK2C8XTIoEgs3/gNn4bvYfJidFYXVxQRG3kb0RPZzfC4WWHRjOc9h/Aidr6D9LTMo72DfQl7ywsZI6MaKH+ZRDqX2/H6ufOK6jC4t0ofWsfDPqZaAo3dSHgXxzUaIYKYg3Ha+rChw5K42fn/kRvrwpTf+jAZDJgsVjg9/pwov4kNBo1nlv7DGwOG9gJiejvU+FqdychlYer+C63b1Amq8KaJ7jwBJfQ/FUzrA/siI9jYqD/Jta9vAEejxs/3rgGr9sJl28RPVev04COHFJT++E+p9fbVnmoHHHReDooOzo7rsDpciIaAbTaIWRlb8UDmwVnzzbCarbCanPAYrPjYptCSmSy4/XJKal1ktK3kchmwWRzoUUhh8NqRSgKDA8PIntLDuz0+bz8HDhJHExN6ZH4WAqq35UqyIFSycj42Nj6CEXhYTCIYCCAlasy8NKL67Gw4MDo6F28nv0Gpg163NOqEfAHQOjkCL2tfnK1lVRUvncyLX1VzbHqKlz7QYVbdDgUHazZOB/gcrnapOSku0ajsexNkZhTVCDEqTOfwevxwDCjh9fl+IJUHDl6msfbVF1cJIKitR3jEzpEIhGY5ueWv+/5bsU/E7okEOazdgrz8PGpM/DQZrxuN53H/CekXPLOhChf/MIrG9bRvltgNpsRCYVx32iEUtkb01xSVk5t2ZqLLD4PDQ2N8C76EA2FMDc7rSPSiiOB/Qf2sp99OhNNF1rh93ngcroxO2+AsrcnBpAcrqKyN2dBKMjBp6c/h9vpjFmaM+iDJE8gpj6qrYPda0dzkxwhmhwOLSMajeIn1fUYYP/BCqp4VyFMJgs6Oq8gshxChIrARpshmZnPUw2NX0KlvIlLrS10exQJHDaeWrMWd9Q/xwDbtuVSX7ddwo7tefS39WCtYCF9ZQZYDAbIq/zNEcGO/LiZmUlqaEgNGg0Gkwk2J4HcGVbHADzea5RAVEB1d3XASauNoxXS40ziGXHRvwAVvrukyLa34QAAAABJRU5ErkJggg==",
    keyYellow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACi0lEQVQ4jX2TS0hUURzGv3POfcwdx8GZVHzMCDOZFpHIiPQgXJg2tTCwSClatLBVCwOX0SZatKl2QUQtCiNqkRENtUjTSoyYsjItNUwTlZkcfIyPO/eec1qohDTjt/w4v4//+f78SUNDAzLJ5lLlnDQFCq1mT9ZyeWJRGx+LuZ6oTNxnVCYBQMkEpyypFeQqD88fl42hwCQYG0Fi0i6LDhfV3+6paFky2RFGZZymg7mQyPXol69e8DVWVwHMYaM7WoLn8Wtw+sK4eLQ/xKh8wAXxpg0wTZEdrik8V1DiBFYkIG30/dyF2mOtSPla4fcu4kBwts606Ym0AYpCdlfvyffC5BsO9m//ivabbZjqvQSvm6OieB4KlaG0HRBCUqrCALluWAw1lTOo9t+ACg2gOrigkICSdgLLEgPRgcQEVPbPtCkMQwOjGiCBvl8eCEEG05coFW9ydoiDCwDrT4gEqARxWOgeLMDHCc8nXRWP//vCsslKaytjkfry94HV3zNweIoBBohVisScga7Pftx7F5xhVJ6hRE5uClgxyd6qstVnTQeH8wwHgSP1DYiP41bnzu8fRotm55Na1tyy1qOr/AolMr5W78bqLHkoUMQ6TtbEXU6dIzePAFLg5ZttePQ2r01VZERhEoZmb94YANi2PJ3v1e6eqrP0bMOG368hPm2Ip71BM9Lv6zN0EaFEIp0o57LF6VTbmw/n6C6HhbJgNqDZ6Boo/HKnc4c/ZdOmTDAAUCGxaGiASlMIVeSDUIKFmBMqlSUuw+aUyD8ZaQAK52I0x60vhMPlbvAxwOK43lE6Ev2RddbQbHsrGAAUSjGsqurrF6/i+2KxZGppyaWNTStuLuiUwtZOdiv9BTLFAAB6Bi65AAAAAElFTkSuQmCC",
    keyRed: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACeklEQVQ4jX2TO0zTURTGv3vv/9F/H4Q2LZRHa4o8fASGGuJjMBEluDAQI0Tj4ICTkUQZ3YyJxsHEyRijgwZjdFBjbHQCnDAGMQqioDYgMUBttdACbf/3HheNoK1nPDnfL/m+cw7r7OxEqbKJdMlYd0QWeryrK00pzZiJu9wPdKVuC6IMAGilxHkiI6hrd08K6orOzkHEp5HK2o2j/pr2683NvVkhDgqiBC8mlkTwm+a5i5tqu1oFIKSN4WAYTy5cgrOjHWdfj0cF0R3JmK8oICeVp6O66kTQ5QQUAbaNkYataOs7g3zfKYSWs9iTTB/IcX6oqAWNs+2tlRU+ZNIAA6Bp2D35FgP9p1HzOY59UqElncVQwBstCmCM5XUh/jSEwN7UPFqvXoFOBmCUQXIGArSiFgpSjY8mU7Pg6yCMwzIMCMMAAIx4PVCMvSseoq75Mh8mJUgB/PcIAURgBRvDwQBeecvGTKXu/2NhhYv6tu+LsfaxF5G1hXk4wrUAAMU4Ug4Lg+EQbtXVzQuiY5xobgNglbGdO+y1x90zUwGLMTgmJoBPX3BtW9P7ly3VybRmuH4YxnNTyvOcKAGsO6Qc0f6IJh4eTibcTiXhFwwoKDzzeXHP5+/XQTGNCJZtb9wYANhERytM4+YRVTA90kbIMJAwLfUoUpeLVdeOWKRinKhYXOCSqNep6wM93nLTbRfQ6PEAysZgoOrNjc0NoTzn3aXEAMAVsGwB0At5RCsrwBjDkumEDgq7C7bkRN9KqgFoUqmP5Q5zqWNLUxlm4oCSuByqnx41Xcct+ZfhYgAOTOmaPvR0IbFrMZ3JZw23EWdameT8q/brZf9XPwERTf+roi2jYwAAAABJRU5ErkJggg==",
    keyGreen: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACbElEQVQ4jX2TS0iUURzFz31933wz44yOjviYERTTIjCYkLJFkCW2cSGRUrRoYW1cuHAV7aJFm2odUYvCiFpUREOt1FZGWNEblUwTmxwdfI7OzHfvv8UgIc147upy7/n97zlwWVdXF4qJXFLQrAf1ud5cWbqZp6wZNe1/Qsrch6B1AJDFzCZLlqdKPgz2U/ef2BzmxSR0ym0qH6/pKL3d0ocNcRKCkrzgZE1wKuwrLdci3b5WwAgXwdE6XHxxHW3eTqQvf4hB0ANoFioIcDOmpKGz+kKwygsNgoaLmrF96G8fQG92ACa6BhxZOoEMP1UwgpBsf6S1MpTFCvI5JWbbPuHS0CAWa39AHNNgLSugkXCscAeMZYUSoO0tBNJHE4i33kRAWQjCBjQHCLJgBJ0znxPjqVkJ8Y8JDtuxoISV72msDDDsa0GA1DI0tf5NGxgwbF+h/GI5sNEqsHdl72Gbx/9FYGnRuNm+EJ/oeFPvbiUQ9tTmDwyHTDnwDEeh7jUkSNA5cJrbCdhkh9jBreeLPRNh7jD89HzBMmbgubX3e83bmiWxYvn4svWabH0VnJL5grcfmKHjdr14unk66YdXQ1UwMBjQq3KwR+FBpShOkkCOuzMuABiXzjqV1l3vmZy9UeLCG7WQTjom8Kwh48QjY+SYODihkDhp6rO8aqi2t9Q2/hxCTSUwcOEbrv7ov7MniizvKWbOAwzWuAO4KotIrBKMMchVL0hRHfldDU6LRd0ApNFmyim1Vw90Ngd+YRqARvBG4yQb9503juvuZgYAyTgmpFIjMy+Th38vrGe3NvwWm5YBpvk8ZP7L7qa/51LzXlKvOSsAAAAASUVORK5CYII=",
    minusSimple: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAL0lEQVQ4jWP8//8/IwMFgIkSzaMGUMkAFhiDkZHxHyka////z0QVFzCOJqThYAAAIOcKHde8N5QAAAAASUVORK5CYII=",
    plusSimple: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARUlEQVQ4jdWRMQ4AIAjErP9/M+eiiyEyYCTeSjiagiRaIj2zHBYABlgdwR8FrDdGsvZI6ncJ3OGkWte81EusLzhKfEIwANMfFhcD7xBqAAAAAElFTkSuQmCC",
    pin: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAADBmlDQ1BpY2MAAHjaY2BgnuDo4uTKJMDAUFBUUuQe5BgZERmlwH6egY2BmYGBgYGBITG5uMAxIMCHgYGBIS8/L5UBFTAyMHy7xsDIwMDAcFnX0cXJlYE0wJpcUFTCwMBwgIGBwSgltTiZgYHhCwMDQ3p5SUEJAwNjDAMDg0hSdkEJAwNjAQMDg0h2SJAzAwNjCwMDE09JakUJAwMDg3N+QWVRZnpGiYKhpaWlgmNKflKqQnBlcUlqbrGCZ15yflFBflFiSWoKAwMD1A4GBgYGXpf8EgX3xMw8BSMDVQYqg4jIKAUICxE+CDEESC4tKoMHJQODAIMCgwGDA0MAQyJDPcMChqMMbxjFGV0YSxlXMN5jEmMKYprAdIFZmDmSeSHzGxZLlg6WW6x6rK2s99gs2aaxfWMPZ9/NocTRxfGFM5HzApcj1xZuTe4FPFI8U3mFeCfxCfNN45fhXyygI7BD0FXwilCq0A/hXhEVkb2i4aJfxCaJG4lfkaiQlJM8JpUvLS19QqZMVl32llyfvIv8H4WtioVKekpvldeqFKiaqP5UO6jepRGqqaT5QeuA9iSdVF0rPUG9V/pHDBYY1hrFGNuayJsym740u2C+02KJ5QSrOutcmzjbQDtXe2sHY0cdJzVnJRcFV3k3BXdlD3VPXS8Tbxsfd99gvwT//ID6wIlBS4N3hVwMfRnOFCEXaRUVEV0RMzN2T9yDBLZE3aSw5IaUNak30zkyLDIzs+ZmX8xlz7PPryjYVPiuWLskq3RV2ZsK/cqSql01jLVedVPrHzbqNdU0n22VaytsP9op3VXUfbpXta+x/+5Em0mzJ/+dGj/t8AyNmf2zvs9JmHt6vvmCpYtEFrcu+bYsc/m9lSGrTq9xWbtvveWGbZtMNm/ZarJt+w6rnft3u+45uy9s/4ODOYd+Hmk/Jn58xUnrU+fOJJ/9dX7SRe1LR68kXv13fc5Nm1t379TfU75/4mHeY7En+59lvhB5efB1/lv5dxc+NH0y/fzq64Lv4T8Ffp360/rP8f9/AA0ADzTzG2NJAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAACYktHRAD/h4/MvwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+ABCw0JBgCIkrwAAADNSURBVCjPdZA9DgFRFIVPMCFRSFQTBQ293z1oRWMJLECoLUHsAdEoRERjA0QvEhGNaBUa8inGzDwznFu83HvO/XlHKBQ5ZmTcTD8EHWCH7WQRhfGQVNZCtqQfEywmONhih1dYjPGxJetTcUTU63Yxj0lKqa2G0jooqrp3yVQbobUQBe4EMSZmfrPKNUBbQR9KHD166XabPux18La/9DRc+SiHwIozACcS/gTn6QIjRJErsCPyLWgCfdxzb/RM60SFCy2jlCf5LRhQQ//jDXleGJr4KuKfAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTAxLTExVDEzOjA5OjA2KzAxOjAw8Rgr6AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0wMS0xMVQxMzowOTowNiswMTowMIBFk1QAAAA3dEVYdGljYzpjb3B5cmlnaHQAQ29weXJpZ2h0IDE5OTkgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQxbP9tAAAAHHRFWHRpY2M6ZGVzY3JpcHRpb24ARG90IEdhaW4gMjAlk5c01gAAAB10RVh0aWNjOm1hbnVmYWN0dXJlcgBEb3QgR2FpbiAyMCWy7qr9AAAAFnRFWHRpY2M6bW9kZWwARG90IEdhaW4gMjAlMnX1qwAAAABJRU5ErkJggg==",
    pinActive: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAe1BMVEX/////zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv/zBv////a7dsHAAAAJ3RSTlMAQPLg8wreGfQY6utB+GxtU/taZ7ywq+3urK+9aL6trpeZf4BeYC49Q3tiAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+ABCw0HIEwGOs8AAABlSURBVBjTXc1HEoAwCEBRYu+99879b2hGo0b+KrzJAACPKSpPY/Ckq8gz9BfAtBAtG6QcRFeewaVAf3g+ov8dgQCvwmeO4hviRECa5UVZ1U3bSVvaHv4NI4FpJrCsBLadwHGIxwkpXgeBl9dpZwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wMS0xMVQxMzowNzozMyswMTowMDNmMx8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTYtMDEtMTFUMTM6MDc6MzIrMDE6MDDkTIAXAAAAAElFTkSuQmCC"
};