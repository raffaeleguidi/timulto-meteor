
Template.chisiamo.rendered = function () {

    var now = moment();
//    console.log("resetting last used to " + now.toString());
    Session.set("lastUsed", now.toString());
};

Template.chisiamo.created = function(){
    depth = 1;
};
//Template.chisiamo.rendered = function(){
//     var now = moment();
//    Session.set("lastUsed", now);
//};

Template.chisiamo.events({
    "click #shoot": function (event) {
        Router.go('/crea');
    },
    "click #sendmessage": function (event) {
        Meteor.call("sendMessage", $("#msgto").val(), { title: $("#msgtitle").val(), message: $("#msgmessage").val()}, function(err, res) {
            if (err) {
                alert(err);
            } else {
                alert("messaggio inviato");
            }
        })
    }
});
