module.exports = function (RED) {

    function GoogleActionsSpeakNode(config) {

        RED.nodes.createNode(this, config);

        this.on('input', function(msg) {

            msg.conversation.response.prompt.firstSimple = {
                speech: msg.payload,
                text: msg.payload
            };

            this.send(msg);

        });

    }
    
    RED.nodes.registerType("Google Actions Speak", GoogleActionsSpeakNode);

}