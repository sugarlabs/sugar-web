define(function () {
    var util = {};

    util.hasClass = function (ele, cls) {
        result = ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        return (result !== null);
    };

    util.addClass = function (ele, cls) {
        if (!util.hasClass(ele, cls)) {
            ele.className += " " + cls;
        }
    };

    util.removeClass = function (ele, cls) {
        if (util.hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    };

    return util;
});
