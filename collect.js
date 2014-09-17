#!/usr/bin/env node

var teleinfo = require("teleinfo");
var util = require('util');
var ThingSpeakClient = require('thingspeakclient');

var key = process.env["THINGSPEAK_KEY"] 
if (typeof(key) === 'undefined') {
  console.error("ERROR: Environment variable THINGSPEAK_KEY is not set.") 
  process.exit(1)
}

var client = new ThingSpeakClient();
client.attachChannel(14248, { writeKey: key });

var trameEvents = teleinfo("/dev/ttyAMA0");

var lastSent;

trameEvents.on('tramedecodee', function (data) {
  var consommation = { field1: data.HCHC, field2: data.HCHP, field3: data.IINST, field4: data.PAPP}
  var currentDate = new Date();
  if (!lastSent || ((currentDate - lastSent) > 15 * 1000)) {
    client.updateChannel(14248, consommation);   
    console.log(util.inspect(data));
    lastSent = currentDate;
  } 
});

trameEvents.on('error', function (err) {
	console.log(util.inspect(err));
});

