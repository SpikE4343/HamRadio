// var fs = require('fs');
var jBinary = require('jbinary');

var data = {

//# 50 Tones
  tones: [67.0, 69.3, 71.9, 74.4, 77.0, 79.7, 82.5,
         85.4, 88.5, 91.5, 94.8, 97.4, 100.0, 103.5,
         107.2, 110.9, 114.8, 118.8, 123.0, 127.3,
         131.8, 136.5, 141.3, 146.2, 151.4, 156.7,
         159.8, 162.2, 165.5, 167.9, 171.3, 173.8,
         177.3, 179.9, 183.5, 186.2, 189.9, 192.8,
         196.6, 199.5, 203.5, 206.5, 210.7, 218.1,
         225.7, 229.1, 233.6, 241.8, 250.3, 254.1
       ],

//var TONES_EXTR = [62.5]

//OLD_TONES = list(TONES)
//[OLD_TONES.remove(x) for x in [159.8, 165.5, 171.3, 177.3, 183.5, 189.9,
//                               196.6, 199.5, 206.5, 229.1, 254.1]]

// # 104 DTCS Codes
  dtcsCodes: [
    23,  25,  26,  31,  32,  36,  43,  47,  51,  53,  54,
    65,  71,  72,  73,  74,  114, 115, 116, 122, 125, 131,
    132, 134, 143, 145, 152, 155, 156, 162, 165, 172, 174,
    205, 212, 223, 225, 226, 243, 244, 245, 246, 251, 252,
    255, 261, 263, 265, 266, 271, 274, 306, 311, 315, 325,
    331, 332, 343, 346, 351, 356, 364, 365, 371, 411, 412,
    413, 423, 431, 432, 445, 446, 452, 454, 455, 462, 464,
    465, 466, 503, 506, 516, 523, 526, 532, 546, 565, 606,
    612, 624, 627, 631, 632, 654, 662, 664, 703, 712, 723,
    731, 732, 734, 743, 754
  ],

//# 512 Possible DTCS Codes
// ALL_DTCS_CODES = []
// for a in range(0, 8):
//     for b in range(0, 8):
//         for c in range(0, 8):
//             ALL_DTCS_CODES.append((a * 100) + (b * 10) + c)
//
// var CROSS_MODES = [
//     "Tone->Tone",
//     "DTCS->",
//     "->DTCS",
//     "Tone->DTCS",
//     "DTCS->Tone",
//     "->Tone",
//     "DTCS->DTCS",
//     "Tone->"
// ]

  modes: ["WFM", "FM", "NFM", "AM", "NAM", "DV", "USB", "LSB", "CW", "RTTY",
         "DIG", "PKT", "NCW", "NCWR", "CWR", "P25", "Auto", "RTTYR",
         "FSK", "FSKR"],

  toneModes: [
    "",
    "Tone",
    "TSQL",
    "DTCS",
    "DTCS-R",
    "TSQL-R",
    "Cross"
  ],

  tuningSteps: [
    5.0, 6.25, 10.0, 12.5, 15.0, 20.0, 25.0, 30.0, 50.0, 100.0,
    125.0, 200.0,
    // Need to fix drivers using this list as an index!
    9.0, 1.0, 2.5
  ],

  skipValues: ["", "S", "P"],

  aprs: {
//# http://aprs.org/aprs11/SSIDs.txt
    ssid: [
    "0 Your primary station usually fixed and message capable",
    "1 generic additional station, digi, mobile, wx, etc",
    "2 generic additional station, digi, mobile, wx, etc",
    "3 generic additional station, digi, mobile, wx, etc",
    "4 generic additional station, digi, mobile, wx, etc",
    "5 Other networks (Dstar, Iphones, Androids, Blackberry's etc)",
    "6 Special activity, Satellite ops, camping or 6 meters, etc",
    "7 walkie talkies, HT's or other human portable",
    "8 boats, sailboats, RV's or second main mobile",
    "9 Primary Mobile (usually message capable)",
    "10 internet, Igates, echolink, winlink, AVRS, APRN, etc",
    "11 balloons, aircraft, spacecraft, etc",
    "12 APRStt, DTMF, RFID, devices, one-way trackers*, etc",
    "13 Weather stations",
    "14 Truckers or generally full time drivers",
    "15 generic additional station, digi, mobile, wx, etc"],

    positionComment: [
      "off duty", "en route", "in service", "returning", "committed",
      "special", "priority", "custom 0", "custom 1", "custom 2", "custom 3",
      "custom 4", "custom 5", "custom 6", "EMERGENCY"],

//# http://aprs.org/symbols/symbolsX.txt
    symbols: [
      "Police/Sheriff", "[reserved]", "Digi", "Phone", "DX Cluster",
      "HF Gateway", "Small Aircraft", "Mobile Satellite Groundstation",
      "Wheelchair", "Snowmobile", "Red Cross", "Boy Scouts", "House QTH (VHF)",
      "X", "Red Dot", "0 in Circle", "1 in Circle", "2 in Circle",
      "3 in Circle", "4 in Circle", "5 in Circle", "6 in Circle", "7 in Circle",
      "8 in Circle", "9 in Circle", "Fire", "Campground", "Motorcycle",
      "Railroad Engine", "Car", "File Server", "Hurricane Future Prediction",
      "Aid Station", "BBS or PBBS", "Canoe", "[reserved]", "Eyeball",
      "Tractor/Farm Vehicle", "Grid Square", "Hotel", "TCP/IP", "[reserved]",
      "School", "PC User", "MacAPRS", "NTS Station", "Balloon", "Police", "TBD",
      "Recreational Vehicle", "Space Shuttle", "SSTV", "Bus", "ATV",
      "National WX Service Site", "Helicopter", "Yacht/Sail Boat", "WinAPRS",
      "Human/Person", "Triangle", "Mail/Postoffice", "Large Aircraft",
      "WX Station", "Dish Antenna", "Ambulance", "Bicycle",
      "Incident Command Post", "Dual Garage/Fire Dept", "Horse/Equestrian",
      "Fire Truck", "Glider", "Hospital", "IOTA", "Jeep", "Truck", "Laptop",
      "Mic-Repeater", "Node", "Emergency Operations Center", "Rover (dog)",
      "Grid Square above 128m", "Repeater", "Ship/Power Boat", "Truck Stop",
      "Truck (18 wheeler)", "Van", "Water Station", "X-APRS", "Yagi at QTH",
      "TDB", "[reserved]"
    ]
  }
}


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
    if (def.encoding === 'bcd')
    {
      var s = value.length - 1;
      var base = 0.01
      output = 0.0;
      for (var i = s; i >= 0; --i)
      {
        output += value[i] * base;
        base *= 10;
      }
    }
    else if (Array.isArray(def.encoding))
    {
      output = def.encoding[value];
    }
    else if (def.encoding === 'bool')
    {
      output = value > 0 ? true : false;
    }
    else if( typeof(def.encoding) === 'string')
    {
        output = "";
        for(var i=0; i < value.length; ++i)
        {
          var char = value[i];
          if( def.fill !== undefined && char === def.fill)
            break;

          output += def.encoding.charAt(char);
        }
    }
    else
    {
      output = value;
    }

    return output;
  };

  //
  // Convert human friendly version of value to encoded value
  //
  self.encodeFieldValue = function(def, value) {
    var output = null;
    if (def.encoding === 'bcd')
    {
      var num = value / 100;
      output = [];
      for (var i = 0; i < 6; ++i)
      {
        output.unshift( num % 10 );
        num /= 10;
      }
    }
    else if (Array.isArray(def.encoding))
    {
      output = def.encoding.indexOf(value);
    }
    else if (def.encoding === 'bool')
    {
      output = value ? 1 : 0;
    }
    else if( typeof(def.encoding) === 'string')
    {
        output = [];
        for(var i=0; i < value.length; ++i)
        {
          var char = value.charAt(i);
          if( def.fill != undefined && char == def.fill)
            break;

          output.push(
            def.encoding.indexOf(char));
        }
    }
    else
    {
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
