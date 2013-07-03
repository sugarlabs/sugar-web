define(["sugar-web/graphics/palette"], function (palette) {

    activityPalette = {};

    activityPalette.createActivityPalette = function () { 

        var activityButton = document.getElementById("activity-button");
        var activityPalette = new palette.Palette(activityButton);
        
        activityTitle = document.createElement('input');
        activityTitle.type="text";
        activityTitle.id="title";
        activityTitle.className="expand";

        descriptionLabel=document.createElement('label');
        descriptionLabel.innerHTML="Description :"

        descriptionBox=document.createElement('textarea');
        descriptionBox.rows="5";
        descriptionBox.cols="9";
        descriptionBox.id="description";
        descriptionBox.className="expand";

        var activityContainer = activityPalette.getContainer();
        activityContainer.appendChild(activityTitle);
        activityContainer.appendChild(descriptionLabel);
        activityContainer.appendChild(descriptionBox);    
    };

    return activityPalette;
});