Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Session.set("photo", 'icon-camera-128.png');

  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
    // Show newest tasks first
       return Tasks.find({}, {sort: {createdAt: -1}});
    }, photo: function () {
      return Session.get("photo");
    }
  });

  Template.body.events({
    "click #shoot": function(event) {
        event.preventDefault();
        MeteorCamera.getPicture(function(error, data) {
           Session.set("photo", data);
        })
    },
    "click #send": function (event) {
        event.preventDefault();
        var text = $("#description").val();
        var imageData = $("#imgdata").val();

        Tasks.insert({
          text: text,
          imageData: imageData,
          createdAt: new Date() // current time
        });

        // Clear form
        $("#description").val("");
        Session.set("photo", 'icon-camera-128.png');

        // Prevent default form submit
        return false;
    }
  });
  Template.task.events({
     "click .toggle-checked": function () {
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {$set: {checked: ! this.checked}});
      },
      "click .delete": function () {
        Tasks.remove(this._id);
      }
  });
}


