define(function () {
    icons = {};

    icons.load = function (iconInfo, callback) {
        if ("uri" in iconInfo) {
            source = iconInfo.uri;
        }
        else if ("name" in iconInfo) {
            source = "lib/sugar-html-graphics/icons/" + iconInfo.name + ".svg";
        }

        fillColor = iconInfo.fillColor;
        strokeColor = iconInfo.strokeColor;

        client = new XMLHttpRequest();

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

    return icons;
});
