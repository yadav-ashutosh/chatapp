
let socket = io();

  
const form = document.getElementsByClassName("form");

const messageInput = document.querySelector('#input');
const MymessageContainer = document.querySelector('#bubbles');
const notifcations = document.getElementById('#typing');


let userName;

do{
userName = prompt("Enter your name to join");
}while(!userName);
socket.emit('user-connected' , userName);

socket.on('user-gone', function() {

    let messageDiv= document.createElement('div');
    messageDiv.classList.add('bubble' , 'bubble-wrap');
    let markup = `
    <b>Someone left chat!</b>
    `
    messageDiv.innerHTML = markup;
    MymessageContainer.appendChild(messageDiv);
    scrollTop();

});
socket.on('show-new' , (user)=>{
    console.log("no defer");
    let messageDiv= document.createElement('div');
    messageDiv.classList.add('bubble' , 'bubble-wrap');

    let markup = `

    <b>${user}</b>
    <b>Joined the chat!</b>
    `
    messageDiv.innerHTML = markup;
    MymessageContainer.appendChild(messageDiv);
    scrollTop();
});
socket.on('recieved', function(msg) {

    appendMessage(msg , 'left');
    scrollTop();
});
// socket.on('user-typing' , function(user){
//     notifcations.innerHTML = 'is typing...';
// });

messageInput.addEventListener('keyup' , (e) =>{
   console.log(e.keyCode);
    if(e.key === 'Enter' || e.keyCode === 190){
      sendMessage(e.target.value , 'You');
       e.target.value = '';
  }
})

function sendMessage(msg , str){
 let mesg = {
     user: userName,
     message: msg
 }
 let mesg2 ={
     user: str,
     message: msg
 }
 appendMessage(mesg2 , 'right');
 socket.emit('message' , mesg);
 scrollTop();
}

function  appendMessage(msg , type){
    let messageDiv= document.createElement('div');
    let className = type ;
    messageDiv.classList.add(className , 'bubble' , 'bubble-wrap');

    let markup = `

    <b>${msg.user}</b>
    <br>
    <p>${msg.message}</p>
    `
    messageDiv.innerHTML = markup;
    MymessageContainer.appendChild(messageDiv);
    
}
function scrollTop(){
    MymessageContainer.scrollTop = MymessageContainer.scrollHeight; 
    console.log('scrolling!');
}

