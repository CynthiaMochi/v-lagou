var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/lagou';
var db = mongoose.connection;
mongoose.connect(dbUrl);

db.on('error', console.error.bind(console, '连接错误'));
db.once('open', function(callback){
    console.log('数据库连接成功')
});

exports.save = function(cityName, data) {
    var coll = db.collection(cityName);
    coll.save(data, function(err, res) {
        if(!err) {
            console.log('save to ' + cityName);
        }
    })
}
