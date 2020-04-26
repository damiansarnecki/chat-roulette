const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const User = require('./User.js')


app.use(express.static(__dirname + '/client'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html')
})

const port = process.env.PORT || 3000

http.listen(port, () => {
    console.log(`Listening on ${port}`)
})


let users = []

io.on('connection', (socket) => {

    socket.emit('connected')
    let user = new User(socket)
    users.push(user)
    socket.emit('userCount', users.length)

    socket.on('find', () => {

        if(user.stranger)
            user.disconnect()
        user.searching = true;
        
        for(let stranger of users)
        {
            if(stranger.searching == true && stranger.id != user.id)
            {
                user.strangerFound(stranger)
                stranger.strangerFound(user)
            }
        }
    });

    socket.on('message', (msg) => {
        if(msg.length < 1)
            return
        if(user.stranger == false )
        {
            socket.emit('noStranger')
            return;
        }
        user.socket.emit('message', {msg: msg, stranger: false});
        user.stranger.socket.emit('message', {msg: msg, stranger: true})
    });
  
    socket.on('disconnect', () => {
        user.disconnect()
        deleteUserFromList(user)
    });
});

function deleteUserFromList(userToRemove)
{
    users = users.filter(user => user !== userToRemove)
}

setInterval(() => {
    io.sockets.emit('userCount', users.length)
}, 1000)