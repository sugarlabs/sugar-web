define(function () {

    function getOffset(elem) {
        var _x = 0;
        var _y = 0;
        var _width = elem.offsetWidth;
        var _height = elem.offsetHeight;
        while( elem && !isNaN( elem.offsetLeft ) && !isNaN( elem.offsetTop ) ) {
            _x += elem.offsetLeft - elem.scrollLeft;
            _y += elem.offsetTop - elem.scrollTop;
            elem = elem.offsetParent;
        }
        return {top: _y, left: _x, width: _width, height: _height};
    }

    palette = {};

    palette.Palette = function(invoker) {
        this.invoker = invoker;
        this._container = undefined;
    };

    palette.Palette.prototype._updatePosition = function() {
        var invokerOffset = getOffset(this.invoker);
        this._container.style.top = invokerOffset.top +
            invokerOffset.height + "px";
        this._container.style.left = invokerOffset.left + "px";
    };

    // create a new container for the content of the palette, removing
    // the previous content if it had any
    palette.Palette.prototype._createContainer = function() {
        if (typeof this._container != 'undefined') {
            document.body.removeChild(this._container);
        }
        this._container = document.createElement('div');
        this._container.className = "palette";
        this._container.style.visibility = "hidden";
        document.body.appendChild(this._container);
        this._updatePosition();
    };

    palette.Palette.prototype.getContainer = function() {
        if (typeof this._container == 'undefined') {
            this._createContainer();
        }
        return this._container;
    };

    palette.Palette.prototype.popUp = function() {
        if (typeof this._container == 'undefined') {
            this._createContainer();
        }
        this._container.style.visibility = "visible";
    };

    palette.Palette.prototype.popDown = function() {
        this._container.style.visibility = "hidden";
    };

    palette.Palette.prototype.isDown = function() {
        return typeof this._container == 'undefined' ||
            this._container.style.visibility == "hidden";
    };

    palette.Palette.prototype.toggle = function() {
        if (this.isDown()) {
            this.popUp();
        }
        else {
            this.popDown();
        }
    };

    return palette;
});
