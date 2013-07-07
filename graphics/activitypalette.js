define(["sugar-web/graphics/palette",
        "sugar-web/datastore",
        "sugar-web/env",
        "sugar-web/bus"], function (palette, datastore, env, bus) {

    var activityButton = document.getElementById("activity-button");

    function Activitypalette(button) {
        this.button = button;
    }

    Activitypalette.prototype = new palette.Palette(activityButton);

    Activitypalette.prototype.ActivityPalette = function () {

        var activityTitle;
        var descriptionLabel;
        var descriptionBox;

        activityTitle = document.createElement('input');
        activityTitle.type = "text";
        activityTitle.id = "title";
        activityTitle.className = "expand";

        descriptionLabel = document.createElement('label');
        descriptionLabel.innerHTML = "Description :"

        descriptionBox = document.createElement('textarea');
        descriptionBox.rows = "5";
        descriptionBox.id = "description";
        descriptionBox.className = "expand";

        this.setContent([activityTitle, descriptionLabel, descriptionBox]);

        var aTitle = document.getElementById("title");
        var activityDescription = document.getElementById("description");
        var datastoreObject = new datastore.DatastoreObject();
        var mdata;
        var Title;
        
        bus.listen();
        
        datastoreObject.getMetadata(function (error, metadata) {
            mdata = metadata;
            setTitleDescription();
        });

        setTitleDescription();

        function setTitleDescription() {
            if ((mdata === undefined) || (mdata.title == undefined)) {
                env.getEnvironment(function (error, environment) {
                    Title = environment.activityName;
                    datastoreObject.setMetadata({
                        "activity": environment.bundleId,
                        "activity_id": environment.activityId,
                        "title": Title
                    });
                    datastoreObject.save(function () {});
                    aTitle.value = Title;
                });
            } else {
                if (mdata.title != null) {
                    aTitle.value = mdata.title;
                    datastoreObject.setMetadata({
                        "activity": environment.bundleId,
                        "activity_id": environment.activityId,
                        "title": mdata.title
                    });
                    datastoreObject.save(function () {});
                }

                if (mdata.description != null)
                    activityDescription.value = mdata.description;

            }
        }

        aTitle.onblur = function () {
            datastoreObject.setMetadata({
                "title": aTitle.value
            });
            datastoreObject.save(function () {});
        };

        activityDescription.onblur = function () {
            datastoreObject.setMetadata({
                "description": activityDescription.value,
            });
            datastoreObject.save(function () {});
        };
    
    return Activitypalette;
});
