module.exports = function(io){
    const usernames = [];

    io.sockets.on("connection", function(socket){
        console.log("A user has connected!");

        // Listen adduser event
        socket.on("adduser", function(username){
            // Save
            socket.username = username;
            usernames.push(username);

            // Notify myself
            const data = {
                sender: "SERVER",
                message: "You have joined chatroom."
            };

            socket.emit("update_message", data);

            // Notify other users
            const dataOfUser = {
                sender: "SERVER",
                message: username + " have joined chatroom."
            };

            socket.broadcast.emit("update_message", dataOfUser);

            // Listen send_message event
            socket.on("send_message", function(message){
                // Notify myself
                const data = {
                    sender: "You",
                    message: message
                };

                socket.emit("update_message", data)

                // Notify other users
                const dataMessage = {
                    sender: socket.username,
                    message: message
                };

                socket.broadcast.emit("update_message", dataMessage)
            });

            // User disconnect event
            socket.on("disconnect", function(){
                // Delete username
                for(var i = 0; i < usernames.length; i++){
                    if(usernames[i] == socket.username){
                        usernames.splice(i, 1);
                    }
                }

                // Notify other users
                const dataUserLeft = {
                    sender: "SERVER",
                    message: socket.username + " has left the chat room."
                };

                console.log(dataUserLeft)

                socket.broadcast.emit("update_message", dataUserLeft);
            });
        })
    });
}