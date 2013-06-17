define(function () {
    var palettesGroup = [];

    function getOffset(elem) {
        // Ugly hack to consider the palette margin.
        var style = elem.currentStyle || window.getComputedStyle(elem, '');

        // Remove 'px' from the strings.
        var x = -2 * style.marginLeft.slice(0, -2);
        var y = -1 * style.marginTop.slice(0, -2);

        var width = elem.offsetWidth;
        var height = elem.offsetHeight;
        while (elem) {
            x += elem.offsetLeft - elem.scrollLeft + elem.clientLeft;
            y += elem.offsetTop - elem.scrollTop + elem.clientTop;
            elem = elem.offsetParent;
        }
        return {
            top: y,
            left: x,
            width: width,
            height: height
        };
    }

    palette = {};

    palette.Palette = function (invoker) {
        this.invoker = invoker;
        var paletteElem;
        var containerElem;
        var that = this;
        palettesGroup.push(this);

        invoker.addEventListener('click', function (event) {
            if (!that.invoker.classList.contains("toolbutton")) {
                updatePosition(event.x, event.y);
            }
            that.toggle();
        });

        function updatePosition(clickX, clickY) {
            var paletteX;
            var paletteY;

            if (typeof (clickX) !== 'undefined' &&
                typeof (clickY) !== 'undefined') {
                paletteX = clickX;
                paletteY = clickY;
            } else {
                var invokerOffset = getOffset(that.invoker);
                paletteX = invokerOffset.left;
                paletteY = invokerOffset.top;
            }

            paletteElem.style.left = paletteX + "px";
            paletteElem.style.top = paletteY + "px";
        }

        // create a new palette element with a container, removing the
        // previous content if it had any

        function createPalette() {
            if (paletteElem !== undefined) {
                return;
            }
            paletteElem = document.createElement('div');
            paletteElem.className = "palette";
            paletteElem.style.visibility = "hidden";
            document.body.appendChild(paletteElem);

            if (that.invoker.classList.contains("toolbutton")) {
                invokerElem = document.createElement('div');
                invokerElem.className = "palette-invoker";
                var style = that.invoker.currentStyle ||
                    window.getComputedStyle(that.invoker, '');
                invokerElem.style.backgroundImage = style.backgroundImage;

                invokerElem.addEventListener('click', function (e) {
                    that.toggle();
                });

                paletteElem.appendChild(invokerElem);

            }

            containerElem = document.createElement('div');
            containerElem.className = "palette-container";
            paletteElem.appendChild(containerElem);

            updatePosition();
        }

        this.getPalette = function () {
            if (paletteElem === undefined) {
                createPalette();
            }
            return paletteElem;
        };

        this.getContainer = function () {
            if (paletteElem === undefined) {
                createPalette();
            }
            return containerElem;
        };

        this.isDown = function () {
            return paletteElem === undefined ||
                paletteElem.style.visibility == "hidden";
        };

    };

    palette.Palette.prototype.popUp = function () {
        for (var i = 0; i < palettesGroup.length; i++) {
            otherPalette = palettesGroup[i];
            if (otherPalette != this) {
                otherPalette.popDown();
            }
        }
        this.getPalette().style.visibility = "visible";
    };

    palette.Palette.prototype.popDown = function () {
        this.getPalette().style.visibility = "hidden";
    };

    palette.Palette.prototype.toggle = function () {
        if (this.isDown()) {
            this.popUp();
        } else {
            this.popDown();
        }
    };

    return palette;

});
