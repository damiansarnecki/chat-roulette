class User 
{
    constructor(socket)
    {
        this.id = socket.id
        this.socket = socket
        this.stranger = false
        this.searching = false
    }
    
    disconnect()
    {
        if(this.stranger)
        {
            this.stranger.strangerDisconnected(false)
            this.strangerDisconnected(true)
        }
    }

    strangerDisconnected(isYou)
    {
        this.stranger = false
        this.socket.emit('disconnected', isYou)
    }

    strangerFound(stranger)
    {
        this.stranger = stranger
        this.searching = false
        this.socket.emit('newStranger')
    }
    
}

module.exports = User