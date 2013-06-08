define(["sugar-web/graphics/palette"], function (palette) {
    describe("palette", function () {
        it("should start down", function () {
            var myPalette = new palette.Palette('false invoker');
            expect(myPalette.isDown()).toBe(true);
        });

        it("should toggle", function () {
            var myPalette = new palette.Palette('false invoker');
            myPalette.toggle();
            expect(myPalette.isDown()).toBe(false);
            myPalette.toggle();
            expect(myPalette.isDown()).toBe(true);
        });

    });

});
