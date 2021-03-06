module.exports = function (app,connection, url){
	var headUrl = '/dmp'; //url 앞단의 출력
	var mLows;

	app.get(headUrl,function(req, res){
		res.render('notice');
	})

	//    app.get(headUrl+'/plan', function(req, res){
	//        var sql = 'SELECT * FROM daily_plan';
	//        var mRows;
	//        connection.query(sql, function(err, rows){            
	//            if(err){
	//                console.log(err);
	//                res.status(500).send('Internal Server Error');
	//            }else{
	//                res.send(rows);
	//            }
	//        });
	//    });

	app.get(headUrl+'/plan', function(req, res){
		var date = req.query.date;
		var id = req.query.id;

		if(date ==null){
			var sql = 'SELECT * FROM daily_plan';
			connection.query(sql, function(err, rows){
				if(err){
					res.send(JSON.stringify({"status":01, "error":err, "response":null}));
				}else{
					res.send(JSON.stringify({"status":00, "error":null, "response":rows}));
				}
			});
		}else{
			var sql = 'SELECT * FROM daily_plan WHERE id=\''+id+'\' and date=\''+date+'\'';
			connection.query(sql, function(err, rows){
				if(err){
					res.send(JSON.stringify({"status":01, "error":err, "response":null}));
				}else{
					res.send(JSON.stringify({"status":00, "error":null, "response":rows}));
				}
			});
		}
	});

	app.post(headUrl+'/plan', function(req, res){     
		var sql = 'SELECT * FROM daily_plan';
		connection.query(sql, function(err, rows){            
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			}else{
				var jsonData = req.body;
				for(var i=0; i<jsonData.length; i++){
					var flag=false;     
					for(var j=0; j<rows.length; j++){
						if(jsonData[i].date==rows[j].date && jsonData[i].time == rows[j].time){
							var sql = "UPDATE daily_plan SET plan=?, complete=? WHERE time=? and date=?";
							connection.query(sql, [jsonData[i].plan, jsonData[i].complete, jsonData[i].time, jsonData[i].date], function(err, result, field){
								if(err){
									res.status(500).send('Internal Server Error');
									console.log('Internal Server Error');
									return false;
								}
							});
							flag=true;  
						}   
					}
					if(flag==false){
						var sql = "INSERT INTO daily_plan (time, plan, complete, date, id) VALUES(?, ?, ?, ?, ?)";
						connection.query(sql, [jsonData[i].time, jsonData[i].plan, jsonData[i].complete, jsonData[i].date, jsonData[i].id], function(err, result, field){
							if(err){
								res.status(500).send('Internal Server Error');
								console.log('Internal Server Error');
								return false;
							}
						});
					}
				}
				res.send(rows);
			}
		});
	});

	app.post(headUrl+'/new', function(req, res){
		var jsonData = req.body;

		console.log(jsonData.id);
		var sql = "INSERT INTO new_admin (id, pass) VALUES(?, ?)";
		connection.query(sql, [jsonData.id,	jsonData.pass],function(err, result){
			if(err){
				res.status(500).send('Internal Server Error');
				console.log('Internal Server Error');
				return false;
			}
			res.send(JSON.stringify({"status":00, "error":null, "response":result}));
		});
	});	

	app.get(headUrl+'/login', function(req, res){
		var sql = 'SELECT * FROM new_admin';
		connection.query(sql,function(err, rows){
			if(err){
				res.status(500).send('Internal Server Error');
				console.log('Internal Server Error');
				return false;
			}else{
				res.send(rows);
			}
		});
	});
}

var returnResult = function(err, res){
	var result = {};
	if(err){
		res.status(400);
		result.message = err.stack;
	}else{
		res.status(200);
		result.message = "Success";
	}
	result.status = res.statusCode;
	res.send(result);
}
