
// Listen for messages

export default class GameEventListener {
  constructor(nodeUrl, applicationId) {
    this.ws = new WebSocket(`${nodeUrl}/ws`);
    this.ws.addEventListener("open", () => {
      console.log('here')
      const request = {
        id: this.getRandomRequestId(),
        method: "subscribe",
        params: {
          applicationIds: [applicationId],
        },
      };
      this.ws.send(JSON.stringify(request));
    });

    this.events = {};
    this.ws.addEventListener("message", (event) => {
      this.parseMessage(event.data)
    });
  }

  on(event, func) {
    this.events[event] = func;
  }

  parseMessage(msg) {
    const event = JSON.parse(msg);
    if (event.result.data.events) {
      event.result.data.events.forEach(e => {
        if (e.kind in this.events) {
          let bytes = new Int8Array(e.data);
          let str = new TextDecoder().decode(bytes);
          this.events[e.kind](JSON.parse(str))
        }
      })
    }
  }

  getRandomRequestId() {
    return Math.floor(Math.random() * Math.pow(2, 32));
  };

}
