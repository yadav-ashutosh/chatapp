const app = require('express')();
let ejs = require('ejs');
const bodyParser = require("body-parser");
var express = require('express');
const http = require('http').Server(app);
app.set('view engine', 'ejs');

const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
let userList =[];
let users=0;
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
  res.render('index' , {users : users , userList: userList} );
});

io.on('connection', (socket) => {
  // socket.to(socket.id).emit("inilist", { userList : userList});
  users=users+1;
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-gone');
    users=users-1;
  });
  socket.on("private message", (data) => {
    socket.to(data.to).emit("private message", {
      msg: data.message ,
      from: data.from,
      to : data.to,
    });
  });

  socket.on('user-connected' , (userName) =>{
    userList.push({name : userName , _id : socket.id })
    socket.broadcast.emit('show-new' , {user : userName , users : users , userList: userList});
  });
  socket.on('message' , (msg)=>{
     socket.broadcast.emit('recieved', msg );
  })
});

http.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});