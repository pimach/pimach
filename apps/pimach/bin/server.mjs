import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();



import os from 'os';
import pty from 'node-pty';

let shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const term = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});


app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log('> Client connected ok', socket.id)
    // socket.broadcast.emit('userServerConnection')

    // Forward terminal output to client
    term.onData((data) => {
      console.log(`node-pty: forward data to client`);
      socket.emit('output', data);
    });

    // Handle incoming data from client
    socket.on('input', (data) => {
      console.log(`node-pty: incoming data from client`);
      term.write(data);
    });

    // Handle resize events
    socket.on('resize', (size) => {
      console.log(`node-pty: resize to: `, size.cols, size.rows);
      term.resize(size.cols, size.rows);
    });


    // Cleanup on disconnect
    socket.on('disconnect', () => {
      term.kill()
      console.log('> Client disconnected', socket.id)
      // socket.broadcast.emit('userServerDisconnection', socket.id)
    })    
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Server running on http://${hostname}:${port}`);
    });
});