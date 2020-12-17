module.exports = function(RED) {

    const express                   = require('express');
    const bodyParser                = require('body-parser');
    const https                     = require('https');
    const fs                        = require('fs');
    const events                    = require('events');

    function FulfillmentServerNode(n) {

        RED.nodes.createNode(this,n);

        this.path       = n.path || '/';
        this.port       = n.port || 8090;
        this.privateKey = n.privateKey || null;
        this.cert       = n.cert || null;

        this.sessions = new Map();

        this.events = new events.EventEmitter();

        var app = express().use(bodyParser.json());

        var serverOptions = {
            key: fs.readFileSync(this.privateKey),
            cert: fs.readFileSync(this.cert)
        };

        app.post(this.path, (req, res) => {

            var conversation = {
                handler: req.body.handler.name,
                intent: req.body.intent,
                lang: req.body.session.languageCode || req.body.user.locale,
                response: {
                    session: {
                        id: req.body.session.id,
                        params: {}
                    },
                    prompt: {
                        override: false
                    }
                }
            };

            this.sessions.set(req.body.session.id, {
                request: req,
                response: res
            });

            this.events.emit(req.body.handler.name, req.body.session.id, conversation);

        });

        try {

            this.server = https.createServer(serverOptions, app);
            this.server.listen(this.port);

        } catch (e) {
            this.error("Could not start server: " + e);
        }

        this.on('close', (done) => {
            this.server.close(() => {
                done();
            });
        });

    }

    RED.nodes.registerType("Google Actions Server", FulfillmentServerNode);

}