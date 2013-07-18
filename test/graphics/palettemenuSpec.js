define(["sugar-web/graphics/palettemenu"], function (palettemenu) {
    describe("palettemenu", function () {
        it("should start down", function () {
            var invoker = document.createElement('button');

            var menuData = [
                {label: "One", id: "one-button", icon: true},
                {label: "Two", id: "two-button", icon: true},
                {label: "Three", id: "three-button", icon: true}
            ];

            var myPalette = new palettemenu.PaletteMenu(invoker, undefined,
                                                        menuData);

            var buttons = myPalette.getPalette().
                querySelectorAll('.container button');
            expect(buttons.length).toBe(menuData.length);
        });
    });
});
