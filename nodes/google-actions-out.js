module.exports = function (RED) {

    function GoogleActionsOutNode(config) {

        RED.nodes.createNode(this, config);

        this.on('input', function(msg, send, done) {

            if (msg.conversation) {

                var server = RED.nodes.getNode(msg.conversation.endpoint);

                if (server) {

                    var session = server.sessions.get(msg.conversation.sessionID);

                    if (session) {
                        server.sessions.delete(msg.conversation.sessionID);
                        session.response.send(msg.conversation.response);
                        done();
                    } else {
                        this.error("Could not find session for ID: " + msg.conversation.sessionID);
                    }

                } else {

                    this.error('Could not find endpoint: ' + msg.conversation.endpoint);

                }

            } else {

                this.error('Conversation property not given.');

            }

        });

    }
    
    RED.nodes.registerType("Google Actions Out", GoogleActionsOutNode);

}