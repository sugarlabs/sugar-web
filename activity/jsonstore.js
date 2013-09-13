define(["sugar-web/activity/activity"], function (activity) {

    var jsonstore = {};

    // This is a helper class that allows to store JSON data using
    // standard localStorage.
    //
    // Usage:
    // ------
    //
    // myReadyCallback = function () {};
    // window.addEventListener('jsonstoreReady', myReadyCallback);
    //
    // myStore = jsonstore.JSONStore();
    //
    // var value = myStore.read('key'); // read
    // myStore.write('key', newValue); // write
    //
    // // Or use localStorage directly, and then call save():
    //
    // var value = localStorage['key'];
    // localStorage['key'] = newValue;
    // myStore.save();
    //

    function JSONStore() {
        this.readyEvent = new Event("jsonstoreReady");
        var that = this;

        function onLoaded(error, metadata, jsonData) {
            var data = JSON.parse(jsonData);
            for (var i in data) {
                localStorage[i] = data[i];
            }
            window.dispatchEvent(that.readyEvent);
        }

        if (window.sugar.environment === undefined) {
            // In standalone mode, use localStorage as is.
            window.dispatchEvent(this.readyEvent);

        } else {
            // In Sugar, set localStorage from the datastore.
            localStorage.clear();
            activity.getDatastoreObject().loadAsText(onLoaded);
        }

        function onStop(event) {
            event.preventDefault();
            that.save(function (error) {
                activity.close();
            });
        }
        window.addEventListener('activityStop', onStop);

    }

    JSONStore.prototype.read = function (key) {
        return localStorage[key];
    };

    JSONStore.prototype.write = function (key, value) {
        localStorage[key] = value;
        this.save();
    };

    JSONStore.prototype.save = function (callback) {
        var datastoreObject = activity.getDatastoreObject();
        var jsonData = JSON.stringify(localStorage);
        datastoreObject.setDataAsText(jsonData);
        datastoreObject.save(function (error) {
            if (callback) {
                callback(error);
            }
        });
    };

    jsonstore.JSONStore = JSONStore;

    return jsonstore;

});
