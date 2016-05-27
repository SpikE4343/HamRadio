// var fs = require('fs');
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
  this.map = dataMapping[info.map];

  ///
  // Read memory data from given file
  ///
  self.load = function(path) {
    var p = $q.defer();

    jBinary.load(path + self.filename, self.typeset, function(err, binary) {
      if (err) {
        p.reject("Unable to load file: " + err);
        return;
      }

      self._binary = binary;
      self.data = self._binary.readAll();
      for (var trans in self.data.transcevers)
        self.data.transcevers[trans].page = 1;
      p.resolve(self);
    });

    return p.promise;
  };

  ///
  // Write memory data to filename
  ///
  self.save = function(filename) {
    if (filename === undefined)
      filename = self.filename;

    self._binary.seek(0);
    self._binary.writeAll(self.data);
    self._binary.saveAs(filename);
  };

  self.channelFieldValue = function(trans, channel, fieldName, value) {
    var def = self.map.items.channel.fields[fieldName];

    var fieldValue = null;
    // reference to another data item
    if (def !== undefined && def.ref !== undefined && typeof(def.ref) === 'string') {
      var name = def.ref;
      var bandId = self.data.transcevers.indexOf(trans);
      var channelId = trans.channels.indexOf(channel);
      fieldValue = self.data[name][bandId][channelId];

      if (value !== undefined)
        fieldValue = self.data[name][channelId] = value;

    } else {
      // direct channel.field reference
      fieldValue = channel[fieldName];

      if (value !== undefined)
        fieldValue = channel[fieldName] = value;
    }
    return self.decodeFieldValue(def, fieldValue);
  };

  //
  // Create human friendly version of value
  //
  self.decodeFieldValue = function(def, value) {
    var output = null;
    if (def.encoding === 'bcd') {
      var s = value.length - 1;
      var base = 0.01
      output = 0.0;
      for (var i = s; i >= 0; --i) {
        output += value[i] * base;
        base *= 10;
      }
    } else if (Array.isArray(def.encoding)) {
      output = def.encoding[value];
    } else if (def.encoding === 'bool') {
      output = value > 0 ? true : false;
      } else if( typeof(def.encoding) === 'string') {
        output = "";
        for(var i=0; i < value.length; ++i)
          output += def.encoding.charAt(value[i]);
    } else {
      output = value;
    }
    return output;
  };

  //
  // Convert human friendly version of value to encoded value
  //
  self.encodeFieldVaule = function(def, value) {
    var output = null;
    if (def.encoding === 'bcd') {
      var num = value / 100;
      output = [];
      for (var i = 0; i < 6; ++i) {
        output.unshift( num % 10 );
        num /= 10;
      }
    } else if (Array.isArray(def.encoding)) {
      output = def.encoding.indexOf(value);
    } else if (def.encoding === 'bool') {
      output = value ? 1 : 0;
      } else if( typeof(def.encoding) === 'string') {
        output = [];
        for(var i=0; i < value.length; ++i)
          output.push(def.encoding.indexOf(value.charAt(i)));
    } else {
      output = value;
    }
    return output;
  };
}

angular
  .module('app')
  .factory('RadioFactory', ['$q',
    /** This is the factory method that Angular will execute only ONCE **/
    function RadioFactory($q) {
      /** This is the function that will be injected into the directive, and called multiple times by the programmer **/
      return function(info) {
        /** this is the new object that will be created and used by the programmer **/
        return new Radio($q, info);
      };
    }
  ]);
