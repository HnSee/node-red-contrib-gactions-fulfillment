module.exports = function (RED) {

    function GoogleActionsInNode(config) {

        RED.nodes.createNode(this, config);

        this.handler    = config.handler || 'default';
        this.server = RED.nodes.getNode(config.endpoint);

        if (this.server) {
            
            this.server.events.on(this.handler, (sessionID, conv) => {

                var msg = {
                    conversation: conv
                };

                msg.conversation.sessionID  = sessionID;
                msg.conversation.endpoint   = config.endpoint;

                this.send(msg);

            });

        } else {
            
            this.warn('No endpoint given.');

        }

    }
    
    RED.nodes.registerType("Google Actions In", GoogleActionsInNode);

}