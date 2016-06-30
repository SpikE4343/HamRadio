


angular.module('app')
       .controller('DetailController',
          ['radioService',
           '$q',
           '$mdDialog',
           '$stateParams',
           DetailController])
       .controller('EditDialogController', EditDialogController);

function DetailController(
  radioService,
  $q,
  $mdDialog,
  $stateParams) {

	var self = this;
  self.id = $stateParams.id;
	self.radio = null;
  self.error = null;
  self.channelLimit = 10;
  self.query = { order: "id"};
  self.tableView = false;
  self.selected = [];
  self.selection = {};
  self.transFilter = "";

	self.load = function( id ) {
    radioService.load( id )
      .then( function( radio ) {
        self.radio = radio;
        console.log(radio);
      },function(error) {
          self.error = error;
      });
	};

	self.load(self.id);

  self.showEditDialog = function(radio, trans, channel) {
    $mdDialog.show({
      controller: EditDialogController,
      templateUrl: 'pages/radios/channel.detail.dialog.html',
      parent: angular.element(document.body),
      //targetEvent: ev,
      clickOutsideToClose: true,
      locals: {
        radio: radio,
        transcever: trans,
        channel: channel
      }
    }).then(function(answer) {
        // save changes
        //$scope.status = 'You said the information was "' + answer + '".';
    }, function() {
        // don't save changes
        //$scope.status = 'You cancelled the dialog.';
    });
  };
}

function EditDialogController($scope, $mdDialog, radio, transcever, channel) {
    // Assigned from construction <code>locals</code> options...
    $scope.channel = channel;
    $scope.radio = radio;
    $scope.transcever = transcever;
    $scope.number = transcever.channels.indexOf(channel);
    $scope.fields = radio.map.items.channel.fields;

    $scope.closeDialog = function() {
      // Easily hides most recent dialog shown...
      // no specific instance reference is needed.
      $mdDialog.hide();
    };
  }
