# Node-RED Google Actions Fulfillment

These Node-RED nodes enable Node-RED to serve as a webhook fulfimment endpoint for Google Actions. With them you can interact with Google Actions.

## Installation

Switch to your Node-RED directory, e.g. `~/.node-red` and type:

```bash
npm install <path-to-package>
```

This will install this package for your Node-RED instance.

## Nodes

### Google Actions In
This node acts as an entry point for a Google Action with the given handler. When a Google Actions webhook tries to call your Node-RED server (handler) as a fulfillment server/method this node is called initially if it's handler matches the requested handler.

**Outputs**

This node has only one output, an object named `conversation` with information for the action like parameters, language and more. *This data is needed for the Google Actions Out node. Without it the node cannot send a response.*

(stored as properties of the `msg.conversation` object)
- `handler`
    - The requested handler
- `sessionID`
    - The conversation's id
    - Used internally to identify different conversations in flows
- `lang`
    - The language code requested with the action
    - E.g. 'de-DE' for german
- `intent`
    - The sent intent object
    - with `name`, `params` and `query`
- `response`
    - The internal response object to be sent back to the action
    - Used internally, direct editing is not recommended

### Google Actions Language
This node switches between the given languages according to the conversation's language.

**Inputs**

(stored as properties of the `msg` object)
- `conversation`
    - The conversation object (automatically set when originating from a Google Action In node).

**Outputs**

(stored as properties of the `msg` object)
- `conversation`
    - The conversation object

### Google Actions Speak
This node adds a spoken string to the reponse. The spoken message comes from `msg.payload`.

**Inputs**

(stored as properties of the `msg` object)
- `payload`
    - The string to be spoken.
- `conversation`
    - The conversation object (automatically set when originating from a Google Action In node).

**Outputs**

(stored as properties of the `msg` object)
- `payload`
    - The sent message
- `conversation`
    - The used conversation object

### Google Actions Media
This node adds media to the reponse. This media can be an audio file or other supported media types but support for further types is planned for the future.

**Inputs**

(stored as properties of the `msg` object)
- `conversation`
    - The conversation object (automatically set when originating from a Google Action In node).

**Outputs**

- `conversation`
    - The used conversation object

### Google Actions Out
This node sends a response back to the action. It does not do much on it's own, e.g. spoken messages have to be added by a `Google Action Speak` node.

**Inputs**

(stored as properties of the `msg` object)
- `conversation`
    - The conversation object (automatically set when originating from a Google Action In node).

## Usage

1. Install the package using any method to your Node-RED instance (see above).
2. The nodes should be shown in the `Google Assistant` section.
3. Add a `Google Actions In` node as an entrypoint for the fulfillment.
4. Design your flow. Use `Google Actions Speak` for adding messages to the response.
5. Add a `Google Actions Out` at the end of the flow. *Remember to keep the `conversation` object during the flow.*
6. Configure the endpoint. In the `Google Actions In` node you can configure one. Add an unused port, a URL to be used and informations regarding the SSL certificate (See below for more information on that).
7. Test it. Use a tool for HTTP(S) requests of your choice, e.g. `curl`, and send an example request:

```bash
curl --insecure -X POST -H "Content-Type: application/json" -d '{"handler":{"name":"ExampleHeader"},"intent":{"name":"actions.intent.BRUH","params":{},"query":""},"scene":{"name":"SceneName","slotFillingStatus":"UNSPECIFIED","slots":{}},"session":{"id":"session_id_69420","params":{},"typeOverrides":[]},"user":{"locale":"en-US","params":{"verificationStatus":"VERIFIED"}},"home":{"params":{}},"device":{"capabilities":["SPEECH","RICH_RESPONSE","LONG_FORM_AUDIO"]}}' https://localhost:8090/fulfillment
```

## SSL
According to [Google's webhook requirements](https://developers.google.com/assistant/conversational/webhooks?tool=sdk) you need a valid SSL certificate for your server in order to be accessible by an action. This certificate can be set easily per endpoint as specified above. For obtaining a SSL certificate for your server there are several options:

- Using a DNS adress and Let's Encrypt
    - When you have a DNS adress for your server or home adress (you will need one) you can get a SSL Certificate for free using the Service [Let's Enrypt](https://letsencrypt.org/) with the application [certbot](https://certbot.eff.org/)
    - I would advise you to spin up a temporary NGINX-Server for obtaining it and then just keep the certificate with the key. Those can then be used in the application.
    - There are plenty [tutorials](https://www.digitalocean.com/community/tutorials/how-to-set-up-let-s-encrypt-with-nginx-server-blocks-on-ubuntu-16-04) on how to do so

It is planned to add an option for the nodes to use an HTTP server so this HTTP service can be forwarded then to services like [ngrok](https://snapcraft.io/ngrok). Due to time limitations this functionality has not been implemented yet but is planned for the future.