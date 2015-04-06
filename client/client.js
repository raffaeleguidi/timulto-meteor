var blank = "splash.png";
var photoTaken = false;

function resetPicture() {
    photoTaken = false;
    Session.set("photo", blank);
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var imageObj = new Image();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fill();
    var photo = new Image();
    photo.onload = function() {
        if (photo.width < canvas.width) {
            context.drawImage(photo,
                (canvas.width - photo.width) / 2,
                (canvas.height - photo.height) / 2
            );
        } else {
            context.drawImage(photo,
                0,0,
                canvas.width,
                canvas.height
            );
        }
    };
    photo.src =  Session.get("photo");
}

function fitImageInCanvas(data, canvas) {
    var context = canvas.getContext('2d');
    var photo = new Image();
    photo.onload = function() {
        // canvas.width : x = photo.width : photo.height
        if (photo.width > photo.height) {
            var scaled = (canvas.width * photo.height) / photo.width;
            context.drawImage(photo,
                0,
                (canvas.height - scaled) / 2,
                canvas.width,
                scaled
            );
        } else {
            var scaled = (canvas.height * photo.width) / photo.height;
            context.drawImage(photo,
                (canvas.width - scaled) / 2,
                0,
                scaled,
                canvas.height
            );
        }
    };
    photo.src =  data;
}

function takePhoto() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    MeteorCamera.getPicture({ width: 800, height: 600, correctOrientation: true }, function(error, data) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        geocode();
        if (data) {
            photoTaken = true;
            fitImageInCanvas(data, canvas)
            Materialize.toast("Fai tap sulla foto per mascherare targhe e visi", 2000 , 'rounded');
            Materialize.toast("Completa la scheda e premi \"Multa\"", 3000 , 'rounded');
            Session.set("photo", data);
            $('body').scrollTop(0);
        } else {
            resetPicture();
        }
    });
}

function drawLogo(offsetX, offsetY) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var imageObj = new Image();

    imageObj.onload = function() {
        var w = imageObj.width / 4;
        var h = imageObj.height / 4;
        context.drawImage(imageObj,
            offsetX - (w/2),
            offsetY - (h/2),
            w, h
        );
    };
    imageObj.src =  "icon.png";
}

function geocode() {
    try {
        var coords = Geolocation.latLng();
        if (coords.lat && coords.lng) {
            Meteor.call("reverseGeocode", coords.lat, coords.lng, function(error, results) {
                Session.set("address", results);
            });
        }
    } catch(err) {
        console.log("error geocoding " + err.message);
    }
}

if (Meteor.isClient) {
  Meteor.subscribe("fines");

  Meteor.startup(function(){
      resetPicture();
      $('select').material_select();
      $(".button-collapse").sideNav();
  });

 Template.body.helpers({
    userName: function() {
        //console.log(Meteor.user());
        return Meteor.user().username;
    }, fines: function() {
       return Fines.find({}, {sort: {createdAt: -1}});
    }, address: function () {
      return Session.get("address");
    }, description: function () {
      return Session.get("description");
    }, photo: function () {
      return Session.get("photo");
    }, loc: function () {
      return Geolocation.latLng() || { lat: 0, lng: 0 };
    },
    error: Geolocation.error
  });

  Template.body.events({
    "click #login": function() {
        $('.button-collapse').sideNav('show');
        $('#login-sign-in-link').click();
        $('#login-username').focus();
    },
    "click #shoot": function(event) {
        takePhoto();
    },
    "click #canvas": function (event) {
        if (!photoTaken) {
            takePhoto();
        } else {
            drawLogo(event.offsetX, event.offsetY);
        }
    },
    "click #send": function (event) {
        event.preventDefault();
        var text = $("#description").val();
        var address = $("#address").val();
        var lat = $("#lat").val();
        var lng = $("#lng").val();
        var category = $("#category").val();
        var canvas = document.getElementById('canvas');
        //var imageData = $("#imgdata").val();
        var imageData = canvas.toDataURL();

        Meteor.call("saveFine", text, address, lat, lng, category, imageData);

        // Clear form
/*
        Session.set("description", "");
        Session.set("photo", blank);
        Session.set("address", "");
*/
        $("#address").val("");
        $("#description").val("");
        $("#category").val("");
        $('select').material_select();
        $('body').scrollTop(0);
        Materialize.toast("Grazie per la segnalazione!", 3000 , 'rounded');
        resetPicture();

        // Prevent default form submit (just in case)
        return false;
    }
  });
  Template.fine.events({
     "click .toggle-checked": function () {
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {$set: {checked: ! this.checked}});
      },
      "click .delete": function () {
        Meteor.call("deleteFine", this._id);
      }
  });

  // At the bottom of the client code
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

