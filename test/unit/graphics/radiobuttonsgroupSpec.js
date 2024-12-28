define(["sugar-web/graphics/radiobuttonsgroup"], function (radioButtonsGroup) {
    'use strict';

    var elem1;
    var elem2;
    var elem3;

    beforeEach(function () {
        elem1 = document.createElement('button');
        elem2 = document.createElement('button');
        elem3 = document.createElement('button');
    });

    describe("radioToolButton", function () {
        it("should construct", function () {
            var radio = new radioButtonsGroup.RadioButtonsGroup([elem1, elem2, elem3]);
            expect(radio.elems.length).toBe(3);
        });

        it("should start active the first by default", function () {
            var radio = new radioButtonsGroup.RadioButtonsGroup([elem1, elem2, elem3]);
            expect(radio.getActive()).toBe(elem1);
        });

        it("should start active the first with 'active' class", function () {
            elem2.className = "active red";
            elem3.className = "active blue";
            var radio = new radioButtonsGroup.RadioButtonsGroup([elem1, elem2, elem3]);
            expect(radio.getActive()).toBe(elem2);
        });

        it("should add 'active' class to the selected item", function () {
            var radio = new radioButtonsGroup.RadioButtonsGroup([elem1, elem2, elem3]);
            var elem = radio.getActive();
            expect(elem.classList.contains('active')).toBe(true);
        });

        it("should change the active one on click", function (done) {
            var radio = new radioButtonsGroup.RadioButtonsGroup([elem1, elem2, elem3]);

            // Click elem2
            elem2.addEventListener('click', function() {
                var elem = radio.getActive();
                expect(elem).toBe(elem2);
                expect(elem.classList.contains('active')).toBe(true);

                // Click elem1
                elem1.addEventListener('click', function() {
                    var elem = radio.getActive();
                    expect(elem).toBe(elem1);
                    expect(elem.classList.contains('active')).toBe(true);
                    done();
                });
                elem1.click();
            });
            elem2.click();
        });
    });
});
