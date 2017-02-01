"use strict";

const _ = require('lodash');
const amqp = require('amqplib/callback_api');
const util = require('util');

function Consumer(options) {
  this.options = options;
  let protocol = options.ssl ? 'amqps://' : 'amqp://';
  let creds = `${options.user}:${options.password}`;
  options.url = `${protocol}${creds}@${options.host}:${options.port}/${options.vhost}`;
}

module.exports = Consumer;

Consumer.prototype.start = function() {
  console.log('consumer:', 'Connecting to', this.options.url);
  amqp.connect(this.options.url, (err, conn) => {
    if (err) {
      console.error('consumer:', 'Connection error!', err);
      return;
    }
    console.log('consumer:', 'Connected to AMQP endpoint', this.options.host);

    /* Open a communication channel */
    conn.createChannel((err, ch) => {
      if (err) {
        console.error('consumer:', 'Create channel error!', err);
        return;
      }

      /* Wait for messages published to the Ably Reactor queue */
      ch.consume(this.options.queue.name, (item) => {
        let content = item.content;
        if (item.properties.contentType.indexOf('text/plain') >= 0) {
          if (item.properties.contentType.indexOf('utf-8') >= 0) {
            content = content.toString('utf8');
          } else {
            content = content.toString('ascii');
          }
        } else if (item.properties.contentType.indexOf('application/json') >= 0) {
          content = content.toString('utf8');
        } else {
          content = `(hex) ${content.toString('hex')}`;
        }
        let attributes = {}
        for (let key in item.properties) {
          if (item.properties[key]) {
            attributes[key] = item.properties[key];
          }
        }
        console.log("Message received");
        console.log("Attributes:", attributes);
        console.log("Data:", content);
        console.log("---------\n");
        /* Remove message from queue */
        ch.ack(item);
      });

      console.log('consumer:', 'Waiting for messages from queue', this.options.queue.name);
    });

    conn.on('error', function(err) { console.error('consumer:', 'AMQP client error!', err); });
  });
};
