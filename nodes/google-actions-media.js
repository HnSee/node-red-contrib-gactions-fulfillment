module.exports = function (RED) {

    function GoogleActionsMediaNode(config) {

        RED.nodes.createNode(this, config);

        this.on('input', function(msg) {

            if (!msg.conversation) {
                this.error('Missing conversation object.');
                return;
            }

            msg.conversation.response.prompt.content = msg.conversation.response.prompt.content || {};
            
            msg.conversation.response.prompt.content.media = {
                mediaType: config.mediaType || "MEDIA_TYPE_UNSPECIFIED",
                startOffset: config.offset || "0s",
                optionalMediaControls: [],
                mediaObjects: [
                    {
                        name: config.mediaName,
                        description: config.mediaDescription,
                        url: config.mediaUrl
                    }
                ]
            };

            this.send(msg);

        });

    }
    
    RED.nodes.registerType("Google Actions Media", GoogleActionsMediaNode);

}