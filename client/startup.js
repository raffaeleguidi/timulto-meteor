Meteor.subscribe("fines");
Meteor.subscribe("categories");
Meteor.subscribe("userData");
    
var userWasLoggedIn = false;

/* maybe it should become main.js? */
Deps.autorun(function (c) {
    if(!Meteor.userId()){
        if(userWasLoggedIn){
            Session.set('isadmin', false);
        }
    }
    else {
        Meteor.call("isAdministrator", function (error, result) {
        if (error) {
            console.log("Error occurred: " + error);
            Session.set("isadmin",false);
        }
        Session.set("isadmin",result);
        });
        userWasLoggedIn = true;
    }
    });
    
  function loadCategories () {
    $.get("/api/categories", function(data){
        Session.set("categories", data);
    });
  }

  Meteor.startup(function(){

      //loadCategories();
      depth = 0;

      TAPi18n.setLanguage(getUserLanguage())
          .done(function () {
            Session.set("showLoadingIndicator", false);
          })
          .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
          });      
      
      $('select').material_select();

      Session.set("foundfines",[]);
      Session.set("finesToApprove",[]);
      photoHandling.resetPicture();
//      GoogleMaps.load();
  });
