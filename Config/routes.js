'use strict';

const mysqlConfig = {
	host :               'localhost' ,
	database :        	 'detox', 
	password :           'root' ,
	user :               'root' ,
	port :               3306 ,
}

const mongoConfig = {
	host : 'localhost',
	database : 'detox',
	password : '',
	user : '',
	port : 27017,
	uri : "mongodb://localhost/detox"
}

module.exports = {
    dbConfig : mongoConfig
}