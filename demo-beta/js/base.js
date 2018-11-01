// 公共方法
;(function (a, b) {
    var Tools = {
        trim: function (str) {
            if (typeof str !== 'string') {
                return str;
            }
            if (typeof str.trim === 'function') {
                return str.trim();
            } else {
                return str.replace(/^(\u3000|\s|\t|\u00A0)*|(\u3000|\s|\t|\u00A0)*$/g, '');
            }
        },
        isEmpty: function (obj) {
            if (obj === undefined) {
                return true;
            } else if (obj == null) {
                return true;
            } else if (typeof obj === 'string') {
                if (this.trim(obj) == '') {
                    return true;
                }
            }
            return false;
        },
        isNotEmpty: function (obj) {
            return !this.isEmpty(obj);
        },
        calcPercent: function (value, total) {
            if (isNaN(value) || Number(value) == 0) return '0';
            if (isNaN(total) || Number(total) == 0) return '0';
            return Math.round(Number(value) * 100 / Number(total));
        },
        checkTime: function (str) {
            return new Date(str.replace(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2}(:\d{2})?)/, '$1/$2/$3 $4')).getTime();
        },
        formatContent: function (content) {
            content = content || '';

            // 过滤转义的空格
            content = content.replace(/((&nbsp;)|^(\s*)|(\s*)$)/ig, '');
//          content = content.replace(/<(\/)?(?!img)[^>]+>/ig,'<$1span>');//20150720前,滚轴问题(<br>)
            content = content.replace(/<(\/)?(?!img)[^>]+>/ig, '');//20150720 滚轴修正
            // 处理A，img 标签自带的样式
            content = content.replace(/(id="[^"]+"|class="[^"]+"|style="[^"]+")/ig, '');
            // 给链接文本添加链接
            content = content.replace(/^(\s)*|(\s)*$/g, '');
//            console.log(content)
            return content;
        },
        pasteHtmlAtCaret: function (html) {
            var sel, range;
            if (window.getSelection) {
                // IE9 and non-IE
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();

                    // Range.createContextualFragment() would be useful here but is
                    // non-standard and not supported in all browsers (IE9, for one)
                    var el = document.createElement('div');
                    el.innerHTML = html;
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);

                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            } else if (document.selection && document.selection.type != 'Control') {
                // IE < 9
                document.selection.createRange().pasteHTML(html);
            }
        }
    };
    window.Tools = Tools;
})(window);