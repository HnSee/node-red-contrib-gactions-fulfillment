module.exports = function (RED) {

    function GoogleActionsLangNode(config) {

        RED.nodes.createNode(this, config);

        this.handler    = config.handler || 'default';
        this.languages  = config.languages || ['en'];

        this.on('input', function(msg) {

            var out = [];

            for (let lang of this.languages) {
                if (msg.conversation.lang.includes(lang)) {
                    out.push(msg);
                } else {
                    out.push(null);
                }
            }

            this.send(out);

        });

    }
    
    RED.nodes.registerType("Google Actions Language", GoogleActionsLangNode);

}