var express = require("express"),
	app = express(),
	server =  require("http").createServer(app),
	io = require("socket.io").listen(server),
	port = process.env.PORT || 3000,    
  usernames = [];
  usernames[0] = "";
server.listen(port, function(){
  console.log('listening on *:' + port);
});
app.use(express.static(__dirname + '/public'));
app.get("/",function(request, response){
	response.sendFile(__dirname+"/index.html");
  response.sendFile(__dirname+"/css/style.css");
});
io.on('connection', function (socket) {
  console.log("Socket connected...");
  //userLogin
  function updateusername(){
    io.emit('username',usernames);
  }
  socket.on('newUser', function (data, callback) {
    if(usernames.indexOf(data)!=-1){
      callback(false);
    }else{
      callback(true);
      socket.username = data;
      usernames.push(data);
      updateusername();
    }
  }); 
  //Message sending
  socket.on('messageRequest', function (data) {
    io.emit('newMessage',{message : data, user : socket.username})
  });
  //Disconnect
  socket.on('disconnect', function (data) {
    if(!socket.username){
      return;
    }
    usernames.splice(usernames.indexOf(socket.username),1);
    updateusername();
  });
});
