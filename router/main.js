//
// 이곳은 dmp(daily manage project)의 server입니다.
// 
// @param - app
// @param - connection
// @param - ur
//
// author : sanch 
//

module.exports = function (app,connection, url){
	var headUrl = '/dmp'; //url 앞단의 출력

	app.get(headUrl,function(req, res){
		res.render('notice');
	})

	//    app.get(headUrl+'/plan', function(req, res){
	//        var sql = 'SELECT * FROM daily_plan';
	//
	//        connection.query(sql, function(err, rows){            
	//            if(err){ // 오류발생
	//                res.send(JSON.stringify({"status" : 01, "error": err, "response": null}));
	//            }else{ 
	//                res.send(JSON.stringify({"status" : 00, "error": null, "response": rows}));
	//            }
	//        });
	//    });
	//
	app.get(headUrl+'/plan', function(req, res){
		var date = req.query.date;
		var id = req.query.id;
		var sql ='';

		if(date == null){
			sql = 'SELECT * FROM daily_plan';
		}else{
			sql = 'SELECT * FROM daily_plan WHERE id=\''+id+'\' and date=\''+date+'\'';
		}
		connection.query(sql, function(err, rows){
			if(err){ //오류발생
				res.send(JSON.stringify({"status" : 01, "error":error, "response":null}));
			}else{
				res.send(JSON.stringify({"status" : 00, "error":null, "response": rows}));
			}
		});
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
					for(var j=0; j<rows.length; j++){ //같은 날짜 같은시간 데이터 중복들어올때 업데이트
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
					if(flag==false){ //첫 데이터 세팅
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
}

//var returnResult = function(err, res){
//	var result = {};
//	if(err){
//		res.status(400);
//		result.message = err.stack;
//	}else{
//		res.status(200);
//		result.message = "Success";
//	}
//	result.status = res.statusCode;
//	res.send(result);
//}
