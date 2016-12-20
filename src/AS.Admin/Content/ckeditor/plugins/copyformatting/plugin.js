﻿/*
 Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
(function () {
    function q(a) { var b = (a = a.data) && a.$; return a && b ? CKEDITOR.env.ie && 9 > CKEDITOR.env.version ? 1 === b.button : 0 === b.button : !1 } function k(a, b, e, d) { var c = new CKEDITOR.dom.walker(a); if (a = a.startContainer.getAscendant(b, !0) || a.endContainer.getAscendant(b, !0)) if (e(a), d) return; for (; a = c.next() ;) if (a = a.getAscendant(b, !0)) if (e(a), d) break } function t(a, b) { var e = { ul: "ol", ol: "ul" }; return -1 !== m(b, function (b) { return b.element === a || b.element === e[a] }) } function l(a) {
        this.styles = null; this.sticky = !1; this.editor = a;
        this.filter = new CKEDITOR.filter(a.config.copyFormatting_allowRules); !0 === a.config.copyFormatting_allowRules && (this.filter.disabled = !0); a.config.copyFormatting_disallowRules && this.filter.disallow(a.config.copyFormatting_disallowRules)
    } var m = CKEDITOR.tools.indexOf, r = !1; CKEDITOR.plugins.add("copyformatting", {
        lang: "en", icons: "copyformatting", hidpi: !0, init: function (a) {
            var b = CKEDITOR.plugins.copyformatting; b._addScreenReaderContainer(); r || (CKEDITOR.document.appendStyleSheet(this.path + "styles/copyformatting.css"),
            r = !0); a.addContentsCss && a.addContentsCss(this.path + "styles/copyformatting.css"); a.copyFormatting = new b.state(a); a.addCommand("copyFormatting", b.commands.copyFormatting); a.addCommand("applyFormatting", b.commands.applyFormatting); a.ui.addButton("CopyFormatting", { label: a.lang.copyformatting.label, command: "copyFormatting", toolbar: "cleanup,0" }); a.on("contentDom", function () {
                var e = a.editable(), b = e.isInline() ? e : a.document, c = a.ui.get("CopyFormatting"); e.attachListener(b, "mouseup", function (b) { q(b) && a.execCommand("applyFormatting") });
                e.attachListener(CKEDITOR.document, "mouseup", function (b) { var d = a.getCommand("copyFormatting"); q(b) && d.state === CKEDITOR.TRISTATE_ON && !e.contains(b.data.getTarget()) && a.execCommand("copyFormatting") }); c && (b = CKEDITOR.document.getById(c._.id), e.attachListener(b, "dblclick", function () { a.execCommand("copyFormatting", { sticky: !0 }) }), e.attachListener(b, "mouseup", function (a) { a.data.stopPropagation() }))
            }); a.config.copyFormatting_keystrokeCopy && a.setKeystroke(a.config.copyFormatting_keystrokeCopy, "copyFormatting");
            a.config.copyFormatting_keystrokePaste && a.setKeystroke(a.config.copyFormatting_keystrokePaste, "applyFormatting"); a.on("key", function (b) { var d = a.getCommand("copyFormatting"); b = b.data.domEvent; b.getKeystroke && 27 === b.getKeystroke() && d.state === CKEDITOR.TRISTATE_ON && a.execCommand("copyFormatting") }); a.copyFormatting.on("extractFormatting", function (e) {
                var d = e.data.element; if (d.contains(a.editable()) || d.equals(a.editable())) return e.cancel(); d = b._convertElementToStyleDef(d); if (!a.copyFormatting.filter.check(new CKEDITOR.style(d),
                !0, !0)) return e.cancel(); e.data.styleDef = d
            }); a.copyFormatting.on("applyFormatting", function (e) {
                if (!e.data.preventFormatStripping) {
                    var d = e.data.range, c = b._extractStylesFromRange(a, d), g = b._determineContext(d), f, h; if (a.copyFormatting._isContextAllowed(g)) for (h = 0; h < c.length; h++) g = c[h], f = d.createBookmark(), -1 === m(b.preservedElements, g.element) ? CKEDITOR.env.webkit && !CKEDITOR.env.chrome ? c[h].removeFromRange(e.data.range, e.editor) : c[h].remove(e.editor) : t(g.element, e.data.styles) && b._removeStylesFromElementInRange(d,
                    g.element), d.moveToBookmark(f)
                }
            }); a.copyFormatting.on("applyFormatting", function (b) { var d = CKEDITOR.plugins.copyformatting, c = d._determineContext(b.data.range); "list" === c && a.copyFormatting._isContextAllowed("list") ? d._applyStylesToListContext(b.editor, b.data.range, b.data.styles) : "table" === c && a.copyFormatting._isContextAllowed("table") ? d._applyStylesToTableContext(b.editor, b.data.range, b.data.styles) : a.copyFormatting._isContextAllowed("text") && d._applyStylesToTextContext(b.editor, b.data.range, b.data.styles) },
            null, null, 999)
        }
    }); l.prototype._isContextAllowed = function (a) { var b = this.editor.config.copyFormatting_allowedContexts; return !0 === b || -1 !== m(b, a) }; CKEDITOR.event.implementOn(l.prototype); CKEDITOR.plugins.copyformatting = {
        state: l, inlineBoundary: "h1 h2 h3 h4 h5 h6 p div".split(" "), excludedAttributes: ["id", "style", "href", "data-cke-saved-href", "dir"], elementsForInlineTransform: ["li"], excludedElementsFromInlineTransform: ["table", "thead", "tbody", "ul", "ol"], excludedAttributesFromInlineTransform: ["value", "type"],
        preservedElements: "ul ol li td th tr thead tbody table".split(" "), breakOnElements: ["ul", "ol", "table"], commands: {
            copyFormatting: {
                exec: function (a, b) {
                    var e = CKEDITOR.plugins.copyformatting, d = a.copyFormatting, c = b ? "keystrokeHandler" == b.from : !1, g = b ? b.sticky || c : !1, f = e._getCursorContainer(a), h = CKEDITOR.document.getDocumentElement(); if (this.state === CKEDITOR.TRISTATE_ON) return d.styles = null, d.sticky = !1, f.removeClass("cke_copyformatting_active"), h.removeClass("cke_copyformatting_disabled"), h.removeClass("cke_copyformatting_tableresize_cursor"),
                    e._putScreenReaderMessage(a, "canceled"), this.setState(CKEDITOR.TRISTATE_OFF); d.styles = e._extractStylesFromElement(a, a.elementPath().lastElement); this.setState(CKEDITOR.TRISTATE_ON); c || (f.addClass("cke_copyformatting_active"), h.addClass("cke_copyformatting_tableresize_cursor"), a.config.copyFormatting_outerCursor && h.addClass("cke_copyformatting_disabled")); d.sticky = g; e._putScreenReaderMessage(a, "copied")
                }
            }, applyFormatting: {
                exec: function (a, b) {
                    var e = a.getCommand("copyFormatting"), d = b ? "keystrokeHandler" ==
                    b.from : !1, c = CKEDITOR.plugins.copyformatting, g = a.copyFormatting, f = c._getCursorContainer(a), h = CKEDITOR.document.getDocumentElement(); if (d || e.state === CKEDITOR.TRISTATE_ON) {
                        if (d && !g.styles) return c._putScreenReaderMessage(a, "failed"); d = c._applyFormat(a, g.styles); g.sticky || (g.styles = null, f.removeClass("cke_copyformatting_active"), h.removeClass("cke_copyformatting_disabled"), h.removeClass("cke_copyformatting_tableresize_cursor"), e.setState(CKEDITOR.TRISTATE_OFF)); c._putScreenReaderMessage(a, d ? "applied" :
                        "canceled")
                    }
                }
            }
        }, _getCursorContainer: function (a) { return a.elementMode === CKEDITOR.ELEMENT_MODE_INLINE ? a.editable() : a.editable().getParent() }, _convertElementToStyleDef: function (a) { var b = CKEDITOR.tools, e = a.getAttributes(CKEDITOR.plugins.copyformatting.excludedAttributes), b = b.parseCssText(a.getAttribute("style"), !0, !0); return { element: a.getName(), type: CKEDITOR.STYLE_INLINE, attributes: e, styles: b } }, _extractStylesFromElement: function (a, b) {
            var e = {}, d = []; do if (b.type === CKEDITOR.NODE_ELEMENT && !b.hasAttribute("data-cke-bookmark") &&
            (e.element = b, a.copyFormatting.fire("extractFormatting", e, a) && e.styleDef && d.push(new CKEDITOR.style(e.styleDef)), b.getName && -1 !== m(CKEDITOR.plugins.copyformatting.breakOnElements, b.getName()))) break; while ((b = b.getParent()) && b.type === CKEDITOR.NODE_ELEMENT); return d
        }, _extractStylesFromRange: function (a, b) { for (var e = [], d = new CKEDITOR.dom.walker(b), c; c = d.next() ;) e = e.concat(CKEDITOR.plugins.copyformatting._extractStylesFromElement(a, c)); return e }, _removeStylesFromElementInRange: function (a, b) {
            for (var e = -1 !==
            m(["ol", "ul", "table"], b), d = new CKEDITOR.dom.walker(a), c; c = d.next() ;) if (c = c.getAscendant(b, !0)) if (c.removeAttributes(c.getAttributes()), e) break
        }, _getSelectedWordOffset: function (a) {
            function b(a, b) { return a[b ? "getPrevious" : "getNext"](function (a) { return a.type !== CKEDITOR.NODE_COMMENT }) } function e(a) { return a.type == CKEDITOR.NODE_ELEMENT ? (a = a.getHtml().replace(/<span.*?>&nbsp;<\/span>/g, ""), a.replace(/<.*?>/g, "")) : a.getText() } function d(a, c) {
                var f = a, g = /\s/g, h = "p br ol ul li td th div caption body".split(" "),
                k = !1, l = !1, p, n; do { for (p = b(f, c) ; !p && f.getParent() ;) { f = f.getParent(); if (-1 !== m(h, f.getName())) { l = k = !0; break } p = b(f, c) } if (p && p.getName && -1 !== m(h, p.getName())) { k = !0; break } f = p } while (f && f.getStyle && ("none" == f.getStyle("display") || !f.getText())); for (f || (f = a) ; f.type !== CKEDITOR.NODE_TEXT;) f = !k || c || l ? f.getChild(0) : f.getChild(f.getChildCount() - 1); for (h = e(f) ; null != (l = g.exec(h)) && (n = l.index, c) ;); if ("number" !== typeof n && !k) return d(f, c); if (k) c ? n = 0 : (g = /([\.\b]*$)/, n = (l = g.exec(h)) ? l.index : h.length); else if (c && (n +=
                1, n > h.length)) return d(f); return { node: f, offset: n }
            } var c = /\b\w+\b/ig, g, f, h, k, l; h = k = l = a.startContainer; for (g = e(h) ; null != (f = c.exec(g)) ;) if (f.index + f[0].length >= a.startOffset) return a = f.index, c = f.index + f[0].length, 0 === f.index && (f = d(h, !0), k = f.node, a = f.offset), c >= g.length && (g = d(h), l = g.node, c = g.offset), { startNode: k, startOffset: a, endNode: l, endOffset: c }; return null
        }, _filterStyles: function (a) {
            var b = CKEDITOR.tools.isEmpty, e = [], d, c; for (c = 0; c < a.length; c++) d = a[c]._.definition, -1 !== CKEDITOR.tools.indexOf(CKEDITOR.plugins.copyformatting.inlineBoundary,
            d.element) && (d.element = a[c].element = "span"), "span" === d.element && b(d.attributes) && b(d.styles) || e.push(a[c]); return e
        }, _determineContext: function (a) { function b(b) { var d = new CKEDITOR.dom.walker(a), c; if (a.startContainer.getAscendant(b, !0) || a.endContainer.getAscendant(b, !0)) return !0; for (; c = d.next() ;) if (c.getAscendant(b, !0)) return !0 } return b({ ul: 1, ol: 1 }) ? "list" : b("table") ? "table" : "text" }, _applyStylesToTextContext: function (a, b, e) {
            var d = CKEDITOR.plugins.copyformatting, c = d.excludedAttributesFromInlineTransform,
            g, f; CKEDITOR.env.webkit && !CKEDITOR.env.chrome && a.getSelection().selectRanges([b]); for (g = 0; g < e.length; g++) if (b = e[g], -1 === m(d.excludedElementsFromInlineTransform, b.element)) { if (-1 !== m(d.elementsForInlineTransform, b.element)) for (b.element = b._.definition.element = "span", f = 0; f < c.length; f++) b._.definition.attributes[c[f]] && delete b._.definition.attributes[c[f]]; b.apply(a) }
        }, _applyStylesToListContext: function (a, b, e) {
            var d, c, g; for (g = 0; g < e.length; g++) d = e[g], c = b.createBookmark(), "ol" === d.element || "ul" === d.element ?
            k(b, { ul: 1, ol: 1 }, function (a) { var b = d; a.getName() !== b.element && a.renameNode(b.element); b.applyToObject(a) }, !0) : "li" === d.element ? k(b, "li", function (a) { d.applyToObject(a) }) : CKEDITOR.plugins.copyformatting._applyStylesToTextContext(a, b, [d]), b.moveToBookmark(c)
        }, _applyStylesToTableContext: function (a, b, e) {
            function d(a, b) { a.getName() !== b.element && (b = b.getDefinition(), b.element = a.getName(), b = new CKEDITOR.style(b)); b.applyToObject(a) } var c, g; for (g = 0; g < e.length; g++) c = e[g], -1 !== m(["table", "tr"], c.element) ? k(b,
            c.element, function (a) { c.applyToObject(a) }) : -1 !== m(["td", "th"], c.element) ? k(b, { td: 1, th: 1 }, function (a) { d(a, c) }) : -1 !== m(["thead", "tbody"], c.element) ? k(b, { thead: 1, tbody: 1 }, function (a) { d(a, c) }) : CKEDITOR.plugins.copyformatting._applyStylesToTextContext(a, b, [c])
        }, _applyFormat: function (a, b) {
            var e = a.getSelection().getRanges()[0], d = CKEDITOR.plugins.copyformatting, c, g; if (!e) return !1; if (e.collapsed) {
                g = a.getSelection().createBookmarks(); if (!(c = d._getSelectedWordOffset(e))) return; e = a.createRange(); e.setStart(c.startNode,
                c.startOffset); e.setEnd(c.endNode, c.endOffset); e.select()
            } b = d._filterStyles(b); if (!a.copyFormatting.fire("applyFormatting", { styles: b, range: e, preventFormatStripping: !1 }, a)) return !1; g && a.getSelection().selectBookmarks(g); return !0
        }, _putScreenReaderMessage: function (a, b) { this._getScreenReaderContainer().setText(a.lang.copyformatting.notification[b]) }, _addScreenReaderContainer: function () { return this._getScreenReaderContainer() ? this._getScreenReaderContainer() : CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml('\x3cdiv class\x3d"cke_screen_reader_only cke_copyformatting_notification"\x3e\x3cdiv aria-live\x3d"polite"\x3e\x3c/div\x3e\x3c/div\x3e')).getChild(0) },
        _getScreenReaderContainer: function () { return CKEDITOR.document.getBody().findOne(".cke_copyformatting_notification div[aria-live]") }
    }; CKEDITOR.config.copyFormatting_outerCursor = !0; CKEDITOR.config.copyFormatting_allowRules = "b s u i em strong span p div td th ol ul li(*)[*]{*}"; CKEDITOR.config.copyFormatting_disallowRules = "*[data-cke-widget*,data-widget*,data-cke-realelement](cke_widget*)"; CKEDITOR.config.copyFormatting_allowedContexts = !0; CKEDITOR.config.copyFormatting_keystrokeCopy = CKEDITOR.CTRL + CKEDITOR.SHIFT +
    67; CKEDITOR.config.copyFormatting_keystrokePaste = CKEDITOR.CTRL + CKEDITOR.SHIFT + 86
})();