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
    
    return Activitypalette;
});