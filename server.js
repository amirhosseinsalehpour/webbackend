const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);

  ws.on("message", (messageData) => {
    const message = JSON.parse(messageData);

    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

server.listen(8080, () => {
  console.log("WebSocket server is listening on ws://localhost:8080");
});
