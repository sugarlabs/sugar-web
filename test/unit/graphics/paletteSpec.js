define(["sugar-web/graphics/palette"], function (palette) {
    'use strict';

    describe("palette", function () {
        it("should start down", function () {
            var invoker = document.createElement('button');
            var myPalette = new palette.Palette(invoker);
            expect(myPalette.isDown()).toBe(true);
        });

        it("should toggle", function () {
            var invoker = document.createElement('button');
            var myPalette = new palette.Palette(invoker);
            myPalette.toggle();
            expect(myPalette.isDown()).toBe(false);
            myPalette.toggle();
            expect(myPalette.isDown()).toBe(true);
        });

        it("if one palette in a group popups, the others popdown", function () {
            var invokerA = document.createElement('button');
            var invokerB = document.createElement('button');
            var myPaletteA = new palette.Palette(invokerA);
            var myPaletteB = new palette.Palette(invokerB);
            myPaletteA.toggle();
            expect(myPaletteA.isDown()).toBe(false);
            expect(myPaletteB.isDown()).toBe(true);
            myPaletteB.toggle();
            expect(myPaletteA.isDown()).toBe(true);
            expect(myPaletteB.isDown()).toBe(false);
        });

        it("setContent removes all previous content", function () {
            var invoker = document.createElement('button');
            var myPalette = new palette.Palette(invoker);
            var oldItems = [];
            var newItems = [];
            var i;
            for (i = 0; i < 4; i++) {
                oldItems.push(document.createElement('div'));
                newItems.push(document.createElement('div'));
            }
            myPalette.setContent(oldItems);
            myPalette.setContent(newItems);
            var container = myPalette.getPalette().querySelector('.container');
            expect(container.children.length).toBe(newItems.length);
            for (i = 0; i < oldItems.length; i++) {
                expect(oldItems[i].parentNode).toBe(null);
            }
        });
    });
});
