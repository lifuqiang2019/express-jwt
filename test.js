// app.js

var mongoose = require('mongoose');            

mongoose.connect('mongodb://106.15.192.128:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false')     //连接本地数据库blog 

var db = mongoose.connection;

// 连接成功
db.on('open', function(){
    console.log('MongoDB Connection Successed');
});
// 连接失败
db.on('error', function(){
    console.log('MongoDB Connection Error');
});
