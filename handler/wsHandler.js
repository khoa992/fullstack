const event = {
  CONNECTION: "connection",
  MESSAGE: "message",
  CLOSE: "close",
  ERROR: "error",
};

const initializeWebSocket = (wsServer) => {
  const clients = new Set();

  wsServer.on(event.CONNECTION, (ws) => {
    console.log("New client connected");
    clients.add(ws);

    ws.on(event.ERROR, console.error);

    ws.on(event.MESSAGE, function message(data, isBinary) {
      console.log(`Received message: ${data}`);
      clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    });

    ws.on(event.CLOSE, () => {
      console.log("Client disconnected");
      clients.delete(ws);
    });
  });

  console.log("WebSocket server initialized");
};

module.exports = { initializeWebSocket };
