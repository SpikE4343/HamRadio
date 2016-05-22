var fs = require('fs');
var jBinary = require('jbinary');
var Promise = require('promise');

var Radio = function( info ){
  this.filename = info.file;
  this.data = {};
  this._binary = {};

  this.typeset = info.typeset;
  this.name = info.name;
  this.vender = info.vender;
  this.model = info.model;
  this.map = info.map;
};

Radio.prototype = {
  ///
  // Read memory data from given file
  ///
  load: function( path ) {
    var self = this;
    return new Promise( function( resolve, reject){
      jBinary.load( path + self.filename, self.typeset, function( err, binary){
        if( err ) {
  				reject( "Unable to load file: " + err);
  				return;
  			}

        self._binary = binary;
        self.data = self._binary.readAll();
        resolve( self );
      });
    });
  },

  ///
  // Write memory data to filename
  ///
  save: function(filename) {
    if( filename === undefined )
      filename = this.filename;

    this._binary.seek(0);
    this._binary.writeAll( this.data );
    this._binary.saveAs( filename );
  }
};
