#!/usr/bin/env node

var teleinfo = require("teleinfo");
var ThingSpeakClient = require('thingspeakclient');

function get_env(name) {
  var value = process.env[name]
  if (typeof(value) === 'undefined') {
    console.error("ERROR: Environment variable "+name+" is not set.");
    process.exit(1);
  }
  return value;
}

var key = get_env("THINGSPEAK_KEY");
var channel_id = parseInt(get_env("CHANNEL_ID"));

var client = new ThingSpeakClient();
client.attachChannel(channel_id, { writeKey: key });

var trameEvents = teleinfo("/dev/ttyAMA0");

var lastSent;

function can_send_metrics(previous) {
  var currentDate = new Date();
  return !previous || ((currentDate - previous) > 15 * 1000); 
}

trameEvents.on('tramedecodee', function (data) {
  if (can_send_metrics(lastSent)) {
    var memUsage = process.memoryUsage();
    var consommation = { field1: data.HCHC, field2: data.HCHP, field3: data.IINST, field4: data.PAPP, field5: memUsage.heapUsed}
    client.updateChannel(channel_id, consommation);
    console.log(data);
    lastSent = new Date();
  } 
});

trameEvents.on('error', function (err) {
	console.log(err);
});

