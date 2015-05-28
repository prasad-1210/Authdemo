var mysql = require('mysql');

var pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  connectionLimit : 10,
  supportBigNumbers: true,
  insecureAuth: true,
  connectTimeout: 60000,
  ssl:{
	rejectUnauthorized: false
  },
  acquireTimeout: 60000
});

// Get records from a city
exports.loginUser = function(username, password, callback) {
  var sql = "SELECT username, password, salt FROM tm_users WHERE username=?";
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    connection.query(sql, [username], function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
};

exports.getData = function(orderBy,orderType, start, end, callback){
	var orderByEnum = ['prj.CREATEDAT','PROJECT_NAME','USERNAME','CATEGORY_NAME'];
	orderBy = (typeof(orderBy) == undefined)? 0: orderBy;
	orderType = (typeof(orderType) == undefined)? 'DESC': orderType;
	start = (typeof(start) == undefined)? 0 : start;
	var sql = 'SELECT PROJECT_NAME, USERNAME, CATEGORY_NAME FROM test_db.tm_projects as prj LEFT JOIN test_db.tm_users as users on prj.FK_USER_ID = users.PK_USER_ID LEFT JOIN test_db.tm_categories as cats ON prj.FK_CATEGORY_ID = cats.PK_CATEGORY_ID ORDER BY '+ orderByEnum[orderBy] +' '+orderType+' LiMIT '+start+','+end; 
	pool.getConnection(function(err, connection){
		if(err){console.log(err); callabck(true);return;}
		console.log("connectio acquired "+ connection.threadId);
		connection.query(sql, function(err, results){
			connection.release();
			if(!err){
				console.log("Query Success", err, results);
				callback(false, results);
			}else{
				console.log(err);
				callback(true);
				return;
			}
		});
	});
}

exports.getCount = function(callback){
        var sql = 'SELECT COUNT(PROJECT_NAME) AS count FROM test_db.tm_projects as prj LEFT JOIN test_db.tm_users as users on prj.FK_USER_ID = users.PK_USER_ID LEFT JOIN test_db.tm_categories as cats ON prj.FK_CATEGORY_ID = cats.PK_CATEGORY_ID ORDER BY prj.CREATEDAT DESC';

        pool.getConnection(function(err, connection){
                if(err){console.log(err); callabck(true);return;}
                console.log("connectio acquired "+ connection.threadId);
                connection.query(sql, function(err, results){
                        connection.release();
                        if(!err){
                                console.log("Query Success", err, results);
                                callback(false, results);
                        }else{
                                console.log(err);
                                callback(true);
                                return;
                        }
                });
        });
}

