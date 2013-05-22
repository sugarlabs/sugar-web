define(function (require) {
    var util = require("sugar-html-graphics/util");

    beforeEach(function () {
        elem = document.createElement('div');
    });

    describe("util", function () {
        it("should be able to add a class and check for a class", function () {
            expect(util.hasClass(elem, 'active')).toBe(false);
            util.addClass(elem, 'active');
            expect(util.hasClass(elem, 'active')).toBe(true);
        });

        it("should be able to remove a class", function () {
            util.addClass(elem, 'active');
            expect(util.hasClass(elem, 'active')).toBe(true);
            util.removeClass(elem, 'active');
            expect(util.hasClass(elem, 'active')).toBe(false);
        });

        it("should add and remove a class only once", function () {
            util.addClass(elem, 'active');
            expect(util.hasClass(elem, 'active')).toBe(true);
            util.addClass(elem, 'active');
            expect(util.hasClass(elem, 'active')).toBe(true);
            util.removeClass(elem, 'active');
            expect(util.hasClass(elem, 'active')).toBe(false);
            util.removeClass(elem, 'active');
            expect(util.hasClass(elem, 'active')).toBe(false);
        });

        it("should be able to add and remove more than one class", function () {
            util.addClass(elem, 'red');
            util.addClass(elem, 'blue');
            expect(util.hasClass(elem, 'red')).toBe(true);
            expect(util.hasClass(elem, 'blue')).toBe(true);
            util.removeClass(elem, 'red');
            expect(util.hasClass(elem, 'red')).toBe(false);
            expect(util.hasClass(elem, 'blue')).toBe(true);
        });
    });

});
