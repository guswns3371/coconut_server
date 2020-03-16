var mysql      = require('mysql');
// var dbconfig = require('./config/database');
// var connection = mysql.createConnection(dbconfig);
//
// connection.connect(function (err) {
//     if (err) throw err;
//     else console.log('db_connection.js','database connected');
// });
// module.exports = connection;

//config 파일을 불러와 정보를 매핑시킴
//그 후 connection pool을 생성
module.exports = function () {
    var dbconfig = require('./config/database');
    var pool = mysql.createPool(dbconfig);

    return{
        getConnection : function (callback) {
            pool.getConnection(callback);
        },
        //end function은 외부에서 pool을 close 할 수 있도록 하기 위함
        end : function (callback) {
            pool.end(callback);
        }
    }
};