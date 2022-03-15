const fetch = require('cross-fetch');
const W3CWebSocket = require('websocket').w3cwebsocket;
const URL = require('url').URL;

const CONVERTER_URI = 'localhost:8081';
const CONNECT_LOOP_MS = 1000;

class ConvertListener {
    constructor() {
        // WebSocket status.
        this.connected = false;
        this.createConnectInterval();

        // Conversion status.
        this.lastMessage = null;
    }

    createConnectInterval() {
        // Loop trying to connect while not connected.
        if (this.loop) clearInterval(this.loop);
        this.loop = setInterval(() => {
            if (!this.connected) {
                this.connectToConverter();
            }
        }, CONNECT_LOOP_MS);
    }

    connectToConverter() {
        this.ws = new W3CWebSocket(`ws://${CONVERTER_URI}/websocket`);
        this.ws.onopen = () => {
            this.connected = true;
            clearInterval(this.loop);
        };

        this.ws.onmessage = (e) => {
            this.lastMessage = e.data;
            if (JSON.parse(this.lastMessage)._type === "WIDone") {
                this.lastMessage = null;
            }
        };

        this.ws.onclose = (e) => {
            this.connected = false;
            this.createConnectInterval();
        }
        this.ws.onerror = this.ws.onclose;
    }
}

module.exports = new ConvertListener();