define(["webL10n",
        "sugar-web/activity/shortcut",
        "sugar-web/bus",
        "sugar-web/env",
        "sugar-web/datastore",
        "sugar-web/presence",
        "sugar-web/graphics/icon",
        "sugar-web/graphics/activitypalette"], function (
    l10n, shortcut, bus, env, datastore, presence, icon, activitypalette) {

    'use strict';

    var datastoreObject = null;
    var presenceCallback = null;
    var presenceResponse = null;

    var activity = {};

    activity.setup = function () {
        bus.listen();

        l10n.start();
        
        function sendPauseEvent() {
            var pauseEvent = document.createEvent("CustomEvent");
            pauseEvent.initCustomEvent('activityPause', false, false, {
                                       'cancelable': true});
            window.dispatchEvent(pauseEvent);
        }
        bus.onNotification("activity.pause", sendPauseEvent);

        // An activity that handles 'activityStop' can also call
        // event.preventDefault() to prevent the close, and explicitly
        // call activity.close() after storing.

        function sendStopEvent() {
            var stopEvent = document.createEvent("CustomEvent");
            stopEvent.initCustomEvent('activityStop', false, false, {
                                      'cancelable': true});

            var result = window.dispatchEvent(stopEvent);
            if (result) {
                datastoreObject.save(function() {
                    datastore.waitPendingSave(function() {
                        activity.close();
                    });
                });
            }
        }
        bus.onNotification("activity.stop", sendStopEvent);

        datastoreObject = new datastore.DatastoreObject();

        var activityButton = document.getElementById("activity-button");

        var activityPalette = new activitypalette.ActivityPalette(
            activityButton, datastoreObject);

        // Colorize the activity icon.
        activity.getXOColor(function (error, colors) {
            icon.colorize(activityButton, colors);
            var invokerElem =
                document.querySelector("#activity-palette .palette-invoker");
            icon.colorize(invokerElem, colors);
        });

        // Make the activity stop with the stop button.
        var stopButton = document.getElementById("stop-button");
        stopButton.addEventListener('click', function (e) {
            sendStopEvent();
        });

        shortcut.add("Ctrl", "Q", this.close);

        env.getEnvironment(function (error, environment) {
            if (!environment.objectId) {
                datastoreObject.setMetadata({
                    "title": environment.activityName + " Activity",
                    "title_set_by_user": "0",
                    "activity": environment.bundleId,
                    "activity_id": environment.activityId
                });
            }
            datastoreObject.save(function () {
                datastoreObject.getMetadata(function (error, metadata) {
                    activityPalette.setTitleDescription(metadata);
                });
            });
        });
    };

    activity.getDatastoreObject = function () {
        return datastoreObject;
    };

	activity.getPresenceObject = function(connectionCallback) {
		if (presenceResponse == null) {
			presenceCallback = connectionCallback;
		} else {
			connectionCallback(presenceResponse.error, presenceResponse.presence);
			presenceResponse = null;
		}
		return presence;
	};

    activity.getXOColor = function (callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null, {
                    stroke: result[0][0],
                    fill: result[0][1]
                });
            } else {
                callback(null, {
                    stroke: "#00A0FF",
                    fill: "#8BFF7A"
                });
            }
        }

        bus.sendMessage("activity.get_xo_color", [], onResponseReceived);
    };

    activity.close = function (callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null);
            } else {
                callback(error, null);
            }
        }
        activity.traceStats("activity","stop",window.top.sugar.environment.objectId,null);
        bus.sendMessage("activity.close", [], onResponseReceived);
    };

    activity.traceStats = function (object, action, label, value) {
        if (!user.options.stats) {
            return;
        }
        var statslist = datastore.localStorage.getValue('sugar_stats');
        if (!statslist) {
            return [];
        }
        var stat = {};
        stat.user_id = user.networkId;
        stat.user_agent = navigator.userAgent;
        stat.timestamp = new Date().getTime();
        stat.client_type = (document.location.protocol.substr(0,4) == "http" ? "Web App" : "App");
        stat.event_source = window.top.sugar.environment.bundleId;
        stat.event_object = object;
        stat.event_action = action;
        stat.event_label = label;
        stat.event_value = value;
        statslist.push(stat);
		datastore.localStorage.setValue('sugar_stats', statslist);
    };

    activity.showObjectChooser = function (callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null, result[0]);
            } else {
                callback(error, null);
            }
        }

        bus.sendMessage("activity.show_object_chooser", [], onResponseReceived);
    };

    activity.showAlert = function (title, message, btnLabel, btnCallback) {
        if (btnLabel == null) {
            btnLabel = 'Ok';
        }

        // if there are a alert visible, hide it
        activity.hideAlert();

        var fragment = document.createDocumentFragment();
        var div = document.createElement('div');
        div.className = 'alert';
        div.id = 'activity-alert';
        div.innerHTML = '<p><b>' + title + '</b><br/>' + message + '</p>' +
            '<p class="button-box">' +
            '<button id="actvity-alert-btn" class="icon">' +
            '<span class="ok"></span>' +
            btnLabel + '</button></p>';
        fragment.appendChild(div);

        document.body.appendChild(fragment.cloneNode(true));

        var btn = document.getElementById("actvity-alert-btn");
        btn.addEventListener('click', function (e) {
            activity.hideAlert();
            if (btnCallback != null) {
                btnCallback();
            }
        });

    };

    activity.showConfirmationAlert = function (title, message, btnOkLabel,
                                               btnCancelLabel, btnCallback) {
        /*
        title, message, btnOkLabel and btCancelLabel are str parameters
        callback is a function called when the user press a button,
        and receives a boolean with true if the user pressed the Ok button
        */
        if (btnOkLabel == null) {
            btnOkLabel = 'Ok';
        }
        if (btnCancelLabel == null) {
            btnCancelLabel = 'Cancel';
        }

        // if there are a alert visible, hide it
        activity.hideAlert();

        var fragment = document.createDocumentFragment();
        var div = document.createElement('div');
        div.className = 'alert';
        div.id = 'activity-alert';

        div.innerHTML = '<p><b>' + title + '</b><br/>' + message + '</p>' +
            '<p class="button-box">' +
            '<button id="actvity-alert-ok-btn" class="icon">' +
            '<span class="ok"></span>' +
            btnOkLabel + '</button>' +
            '<button id="actvity-alert-cancel-btn" class="icon">' +
            '<span class="cancel"></span>' +
            btnCancelLabel + '</button>' +
            '</p>';

        fragment.appendChild(div);

        document.body.appendChild(fragment.cloneNode(true));

        var okBtn = document.getElementById("actvity-alert-ok-btn");
        var cancelBtn = document.getElementById("actvity-alert-cancel-btn");

        function hideAlertAndReply(result) {
            activity.hideAlert();
            if (btnCallback != null) {
                btnCallback(result);
            }
        }

        okBtn.addEventListener('click', function (e) {
            hideAlertAndReply(true);
        });

        cancelBtn.addEventListener('click', function (e) {
            hideAlertAndReply(false);
        });

    };

    activity.hideAlert = function() {
        var alertNode = document.getElementById("activity-alert");
        if (alertNode && alertNode.parentNode) {
            alertNode.parentNode.removeChild(alertNode);
        }
    };

    return activity;
});
