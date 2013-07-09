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
        descriptionLabel.innerHTML = "Description :";
        descriptionBox = document.createElement('textarea');
        descriptionBox.rows = "5";
        descriptionBox.id = "description";
        descriptionBox.className = "expand";

        this.setContent([activityTitle, descriptionLabel, descriptionBox]);

        var titleElem = document.getElementById("title");
        var descriptionElem = document.getElementById("description");
        var datastoreObject = new datastore.DatastoreObject();
        var mdata;
        var title;

        bus.listen();

        datastoreObject.getMetadata(function (error, metadata) {
            mdata = metadata;
            setTitleDescription();
        });

        setTitleDescription();

        function setTitleDescription() {
            if ((mdata === undefined) || (mdata.title === undefined)) {
                env.getEnvironment(function (error, environment) {
                    title = environment.activityName;
                    datastoreObject.setMetadata({
                        "activity": environment.bundleId,
                        "activity_id": environment.activityId,
                        "title": title
                    });
                    datastoreObject.save(function () {});
                    titleElem.value = title;
                });
            } else {
                if (mdata.title !== undefined) {
                    titleElem.value = mdata.title;
                    datastoreObject.setMetadata({
                        "activity": environment.bundleId,
                        "activity_id": environment.activityId,
                        "title": mdata.title
                    });
                    datastoreObject.save(function () {});
                }

                if (mdata.description !== undefined)
                    descriptionElem.value = mdata.description;
            }
        }

        titleElem.onblur = function () {
            datastoreObject.setMetadata({
                "title": this.value
            });
            datastoreObject.save(function () {});
        };

        descriptionElem.onblur = function () {
            datastoreObject.setMetadata({
                "description": this.value
            });
            datastoreObject.save(function () {});
        };
    };
    return Activitypalette;
});
