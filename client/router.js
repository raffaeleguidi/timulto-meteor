
Router.route('/', function () {
  this.render('crea');
});

Router.route('/crea', function () {
  this.render('crea');
});

Router.onBeforeAction(function() {
  GoogleMaps.load();
  this.next();
}, { only: ['mappa'] });

Router.map(function(){
  this.route('mappa', {path: '/mappa'});
});

Router.map(function(){
  this.route('chisiamo', {path: '/chisiamo'});
});

Router.map(function(){
  this.route('fineDetails', {path: '/dettaglio'});
});

Router.map(function(){
  this.route('segnalazioni', {path: '/segnalazioni'});
});

