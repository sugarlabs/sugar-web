define(["sugar-web/graphics/palette",
        "sugar-web/env"], function (palette, env) {

    var activitypalette = {};

    activitypalette.ActivityPalette = function (activityButton,
        datastoreObject) {

        palette.Palette.call(this, activityButton);

        var activityTitle;
        var descriptionLabel;
        var descriptionBox;

        this.getPalette().id = "activity-palette";

        var titleContainer = document.createElement('div');
        titleContainer.className = "row";
        activityTitle = document.createElement('input');
        activityTitle.type = "text";
        activityTitle.id = "title";
        activityTitle.className = "expand";
        titleContainer.appendChild(activityTitle);

        var descLabelContainer = document.createElement('div');
        descLabelContainer.className = "row small";
        descriptionLabel = document.createElement('label');
        descriptionLabel.innerHTML = "Description:";
        descLabelContainer.appendChild(descriptionLabel);

        var descriptionContainer = document.createElement('div');
        descriptionContainer.className = "row expand";
        descriptionBox = document.createElement('textarea');
        descriptionBox.rows = "8";
        descriptionBox.id = "description";
        descriptionBox.className = "expand";
        descriptionContainer.appendChild(descriptionBox);

        this.setContent([titleContainer, descLabelContainer,
                         descriptionContainer]);

        this.titleElem = document.getElementById("title");
        this.descriptionElem = document.getElementById("description");

        this.titleElem.onblur = function () {
            datastoreObject.setMetadata({
                "title": this.value
            });
            datastoreObject.save(function () {});
        };

        this.descriptionElem.onblur = function () {
            datastoreObject.setMetadata({
                "description": this.value
            });
            datastoreObject.save(function () {});
        };
    };

    // Fill the text inputs with the received metadata.
    var setTitleDescription = function (metadata) {
        var that = this;
        if (metadata.title === undefined) {
            env.getEnvironment(function (error, environment) {
                that.titleElem.value = environment.activityName;
            });
        } else {
            this.titleElem.value = metadata.title;
        }

        if (metadata.description !== undefined) {
            this.descriptionElem.value = metadata.description;
        }
    };

    activitypalette.ActivityPalette.prototype =
        Object.create(palette.Palette.prototype, {
        setTitleDescription: {
            value: setTitleDescription,
            enumerable: true,
            configurable: true,
            writable: true
        }
    });

    return activitypalette;
});
