var fs = require('fs');
var jBinary = require('jbinary');

function Radio($q, info) {
  var self = this;
  self.filename = info.file;
  this.data = {};
  this._binary = {};
  this.typeset = info.typeset;
  this.name = info.name;
  this.vender = info.vender;
  this.model = info.model;
  this.map = info.map;

  ///
  // Read memory data from given file
  ///
  self.load = function( path ) {
    var p = $q.defer();

    jBinary.load( path + self.filename, self.typeset, function( err, binary){
      if( err ) {
				p.reject( "Unable to load file: " + err);
				return;
			}

      self._binary = binary;
      self.data = self._binary.readAll();
      p.resolve( self );
    });

    return p.promise;
  };

  ///
  // Write memory data to filename
  ///
  self.save = function(filename) {
    if( filename === undefined )
      filename = self.filename;

    self._binary.seek(0);
    self._binary.writeAll( self.data );
    self._binary.saveAs( filename );
  };
}

angular
  .module('app')
  .factory('RadioFactory',[ '$q',
    /** This is the factory method that Angular will execute only ONCE **/
    function RadioFactory($q) {
       /** This is the function that will be injected into the directive, and called multiple times by the programmer **/
       return function(info) {
           /** this is the new object that will be created and used by the programmer **/
           return new Radio($q, info);
       };
    }
  ]);
