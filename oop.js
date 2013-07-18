define(function () {

    // Source: http://stackoverflow.com/a/4389429/1178541

    var oop = {};

    // This is a constructor that is used to setup inheritance without
    // invoking the base's constructor. It does nothing, so it doesn't
    // create properties on the prototype like our previous example did

    function surrogateCtor() {}

    oop.extend = function (base, sub) {
        // Copy the prototype from the base to setup inheritance
        surrogateCtor.prototype = base.prototype;
        // Tricky huh?
        sub.prototype = new surrogateCtor();
        // Remember the constructor property was set wrong, let's fix it
        sub.prototype.constructor = sub;
    }

    return oop;
});
