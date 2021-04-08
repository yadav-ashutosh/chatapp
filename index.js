const app = require('express')();
var express = require('express');
const http = require('http').Server(app);

const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
let user;
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-gone');
  });
  socket.on('user-connected' , (userName) =>{
    socket.broadcast.emit('show-new' , userName);
  });
  socket.on('message' , (msg)=>{
     socket.broadcast.emit('recieved', msg );
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});