define(function () {

    function getOffset(elem) {
        var x = 0;
        var y = 0;
        var width = elem.offsetWidth;
        var height = elem.offsetHeight;
        while (elem) {
            x += elem.offsetLeft - elem.scrollLeft;
            y += elem.offsetTop - elem.scrollTop;
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
        var container;
        var that = this;

        function updatePosition() {
            var invokerOffset = getOffset(that.invoker);
            container.style.top = invokerOffset.top +
                invokerOffset.height + "px";
            container.style.left = invokerOffset.left + "px";
        }

        // create a new container for the content of the palette, removing
        // the previous content if it had any

        function createContainer() {
            if (container !== undefined) {
                document.body.removeChild(container);
            }
            container = document.createElement('div');
            container.className = "palette";
            container.style.visibility = "hidden";
            document.body.appendChild(container);
            updatePosition();
        }

        this.getContainer = function () {
            if (container === undefined) {
                createContainer();
            }
            return container;
        };

        this.isDown = function () {
            return container === undefined ||
                container.style.visibility == "hidden";
        };

    };

    palette.Palette.prototype.popUp = function () {
        this.getContainer().style.visibility = "visible";
    };

    palette.Palette.prototype.popDown = function () {
        this.getContainer().style.visibility = "hidden";
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
