/**
 * Created by mengchen on 2015/4/17.
 */

var log = function(message) {
    console.log(message);
};

var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function() {
    log("server started.");
});

app.get("/", function(req, res) {
    res.sendFile("chat.html", {root: __dirname});
});

var sockets = {};

io.on("connection", function(socket) {

    socket.on("join", function(name) {
        log("新成员加入：" + name);
        sockets[name] = socket;
    });

    socket.on("message", function(data) {
        var to = data.to;
        var message = data.message;
        log("收到消息：" + message + ", 要发送给：" + to);
        if (sockets[to]) {
            sockets[to].emit("message", message);
}
});
});