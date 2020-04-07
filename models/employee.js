var db = require('./db.js');


function Employee(employee) {
	this.id=employee.id;
	this.email = employee.email;
	this.password = employee.password;
	this.nickName = employee.nickName;
	this.avatar = employee.avatar;
	this.bio=employee.bio;
};
Employee.getUserByName = function (username, callback) {
	var selectSql = 'select * from employee where username = ?';
	db.query(selectSql, [username], function (err, result) {
		if (err) {
			return callback(err);
		}
		var data=result[0];
		callback(err, data);
	});
};
module.exports = Employee;
