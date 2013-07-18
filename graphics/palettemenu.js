define(["sugar-web/graphics/palette", "sugar-web/oop",
        "mustache"], function (palette, oop, mustache) {

    var palettemenu = {};

    palettemenu.PaletteMenu = function (invoker, primaryText, menuData) {
        palette.Palette.call(this, invoker, primaryText);

        this.template =
            '{{#.}}' +
            '<li><button' +
            ' {{ #icon }}class="icon"{{ /icon }}' +
            ' {{ #id }}id="{{ id }}"{{ /id }}' +
            '>' +
            '{{ #icon }}<span></span>{{ /icon }}' +
            '{{ label }}</button></li>' +
            '{{/.}}';

        var menuElem = document.createElement('ul');
        menuElem.className = "menu";
        menuElem.innerHTML = mustache.render(this.template, menuData);
        this.setContent([menuElem]);

        // Pop-down the palette when a item in the menu is clicked.

        var buttons = menuElem.querySelectorAll('button');

        var that = this;

        function popDownOnButtonClick(event) {
            that.popDown();
        }

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', popDownOnButtonClick);
        }
    };

    oop.extend(palette.Palette, palettemenu.PaletteMenu);

    return palettemenu;
});
