
let socket = io();
const form = document.getElementsByClassName("form");
const messageInput = document.querySelector('#input');
const MymessageContainer = document.querySelector('#bubbles');
const notifcations = document.getElementById('#typing');
const chatWindow = document.getElementById('chatWindow');
const listID = document.getElementById('listID')
let userName;

let olduserlist = [];
do{
userName = prompt("Enter your name to join");
}while(!userName);
socket.emit('user-connected' , userName);
let lastUser = userName;

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

function listSetter (newuserlist) {
    newuserlist.forEach((ele)=>{
        if(ele.name != userName){
       let namediv = document.createElement('button');
       namediv.type = "button"
       namediv.classList.add('list')
       let privateInput = document.createElement("input");
       privateInput.classList.add('person');
       privateInput.placeholder ="Send a private message";
       privateInput.id = ele._id ;
       privateInput.name = ele.name ;
       let markup = `<b>${ele.name}</b><br>`
       namediv.innerHTML = markup;
       namediv.appendChild(privateInput)
       listID.appendChild(namediv);
    }
    })
}
socket.on('show-new' , (data)=>{
    let newuserlist = data.userList;
    let finalList = [];
    let  flag =0;
    for(var i=0; i< newuserlist.length; i++) {
        if(flag==1){
            finalList.push(newuserlist[i]);
            lastUser = newuserlist[i].name;
        }
        if(newuserlist[i].name === lastUser ) {
            flag=1;
        }   
    } 
    
    listSetter(finalList);
    addListener();
    Naam = data.user
    numb = data.users
    
    let messageDiv= document.createElement('div');
    messageDiv.classList.add('bubble' , 'bubble-wrap');
    
    let markup = `
    <b>${Naam}</b>
    <p>Joined the chat! We now have ${numb} people In the room</p>
    `
    messageDiv.innerHTML = markup;
    MymessageContainer.appendChild(messageDiv);
    scrollTop();
});
socket.on('recieved', function(msg) {
    appendMessage(msg , 'left');
    scrollTop();
});

messageInput.addEventListener('keyup' , (e) =>{
//    console.log(e.keyCode);
    if(e.key === 'Enter' || e.keyCode === 190){
      sendMessage(e.target.value , false , {});
       e.target.value = '';
  }
})
    
socket.on("private message", function(data) {
    let mesg2 ={
        user: data.from+' sent you privately' ,
        message: data.msg.message
    } 
    appendMessage(mesg2 , 'left');
    scrollTop(); 
 });
function sendMessage(msg , isPersonal , personData ){
 let mesg = {
     user: userName,
     message: msg
 }
 
 if(isPersonal === true){
    let mesg2 ={
        user: 'You sent to '+personData.name+' privately' ,
        message: msg
    }
    appendMessage(mesg2 , 'right');
       socket.emit("private message", { message: mesg, to: personData._id , from: userName });
 }
 else{
    let mesg2 ={
        user: 'You' ,
        message: msg
    }
    appendMessage(mesg2 , 'right');
    socket.emit('message' , mesg);
 }
 scrollTop();
}

function  appendMessage(msg , type ){
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
}
let checkArray = []
 function addListener () { 
    const personArray = document.getElementsByClassName('person');
    [...personArray].forEach( (elem) => {
        if(checkArray.includes(elem.getAttribute("id")) === true){
              return;
        }
        console.log("Adding listeners:)")
        console.log(elem.getAttribute("id"))
        
          elem.addEventListener('keyup', (e) => {
            let personData = {
               name:  e.target.getAttribute("name") ,
               _id : e.target.getAttribute("id")
            }
            if(e.key === 'Enter' || e.keyCode === 190){
                sendMessage(e.target.value , true , personData );
                 e.target.value = '';
            }
            
        }); 
        console.log(checkArray.includes(elem.getAttribute("id")))
        checkArray.push(elem.getAttribute("id"));
        
    });
}

window.onload = addListener();
