define(function () {
    var icon = {};

    icon.load = function (iconInfo, callback) {
        var source;
        if ("uri" in iconInfo) {
            source = iconInfo.uri;
        } else if ("name" in iconInfo) {
            source = "lib/graphics/icons/" + iconInfo.name + ".svg";
        }

        var fillColor = iconInfo.fillColor;
        var strokeColor = iconInfo.strokeColor;

        var client = new XMLHttpRequest();

        client.onload = function () {
            var iconData = this.responseText;
            var re;

            if (fillColor) {
                re = /(<!ENTITY fill_color ")(.*)(">)/;
                iconData = iconData.replace(re, "$1" + fillColor + "$3");
            }

            if (strokeColor) {
                re = /(<!ENTITY stroke_color ")(.*)(">)/;
                iconData = iconData.replace(re, "$1" + strokeColor + "$3");
            }

            callback("data:image/svg+xml," + escape(iconData));
        };

        client.open("GET", source);
        client.send();
    };

    function getBackgroundURL(elem) {
        var style = elem.currentStyle || window.getComputedStyle(elem, '');
        // Remove prefix 'url(' and suffix ')' before return
        return style.backgroundImage.slice(4, -1);
    }

    function setBackgroundURL(elem, url) {
        elem.style.backgroundImage = "url('" + url + "')";
    }

    icon.colorize = function (elem, colors) {
        var iconInfo = {
            "uri": getBackgroundURL(elem),
            "strokeColor": colors.stroke,
            "fillColor": colors.fill
        };

        icon.load(iconInfo, function (url) {
            setBackgroundURL(elem, url);
        });

    };

    return icon;
});
