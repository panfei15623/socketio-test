/**
 * Created by 飞 on 2015/4/17.
 */
var log = function(message){
    console.log(message);
}
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

http.listen(3010, function() {
    log("server started");
})

app.get('/',function(req,res){
    res.sendFile("chatRoom.html",{root:__dirname});
})
app.get('/css',function(req,res){
    res.sendFile("chatRoom.css",{root:__dirname});
})
app.get('/ko',function(req, res){
    res.sendFile("knockout-3.2.0.js",{root:__dirname})
})

var sockets = {};
var nameArr = [];
io.on("connection",function(socket){
    socket.on("join",function(name){
        if(sockets[name]){
            socket.emit("receive","用户已在房间");
        } else {
            sockets[name] = socket;
            nameArr[nameArr.length] = name;
        }
        log("新成员加入：" + name);
        for( nameObj in sockets){
            sockets[nameObj].emit("joined",nameArr);
        }
    });

    socket.on("message", function(data) {
        var toperson = data.toperson;
        var message = data.message;
        log("收到消息：" + message + ", 要发送给：" + toperson);
        if (sockets[toperson]) {
            sockets[toperson].emit("message", message);
        }
    });
})