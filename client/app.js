let socket = io();
const messagesContainer = document.getElementById("messages")
const findButton = document.getElementById("find")
const findButtonText = document.getElementById("findText")
const findButtonDots = document.getElementById("findDots")
const inputField = document.getElementById("text")
const sendButton = document.getElementById("send")
const userCountText = document.getElementById("userCount")

function sendMessage()
{
    socket.emit('message', document.getElementById("text").value);
    document.getElementById("text").value = '';
}

function findStranger()
{
    socket.emit('find');
    startSearchAnimation()
}


function startSearchAnimation()
{    

    findButton.style.backgroundColor = "rgb(255, 187, 0)"
    findButtonText.style.display = "none"
    findButtonDots.style.display = "block"

}

function stopSearchAnimation()
{
    findButton.style.backgroundColor = "#444"
    findButtonText.style.display = "block"
    findButtonDots.style.display = "none"
}

function printMessage(data)
{
    let container = document.createElement("p")
    let nickname = document.createElement("b")

    if(data.stranger == true)
    {
        nickname.innerHTML = "Stranger: "
        nickname.style.color = "rgb(68, 103, 144)"
    }
    else
    {
        nickname.innerHTML = "You: "
        nickname.style.color = "white"
    }
        
    container.append(nickname)
    container.innerHTML +=  data.msg
    messagesContainer.append(container)
}

function clearMessages()
{
    messagesContainer.innerHTML = ""
}

function printSystemMessage(message, color, bold)
{
    let paragraph = document.createElement("p")
    paragraph.innerHTML = message
    paragraph.style.color = color
    if(bold)
        paragraph.style.fontWeight = "bold"
    messagesContainer.append(paragraph)


    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

socket.on('connected', function() {
    clearMessages()
    printSystemMessage("Tap \"find\" button to search for stranger!", "White", true)
});

socket.on('newStranger', function(msg) {
    clearMessages()
    printSystemMessage("New stranger found. Say hi!", "White", true)
    setTimeout(() => stopSearchAnimation(), 1000)
});

socket.on('noStranger', function(){
    printSystemMessage('No stranger to talk with!', "red", true)
});

socket.on('disconnected', function(you){
    if(you)
        printSystemMessage('You disconnected.', "red", true)
    else
        printSystemMessage('Stranger disconnected.', "red", true)
});

socket.on('message', function(data){
    printMessage(data)
    document.getElementById("text").focus()
});

socket.on('userCount', function(userCount) {
    if(userCount == 1)
        userCountText.innerHTML = `One user online`
    else
        userCountText.innerHTML = `${userCount} users online`
})

findButton.onclick = findStranger;
inputField.addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
      sendMessage()
    }
});
sendButton.onclick = sendMessage;