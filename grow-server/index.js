var express = require('express');
var app = express();
var pg = require('pg');
const connectionString = 'postgres://localhost:5432/grow';
var CronJob = require('cron').CronJob;

var client = new pg.Client(connectionString);
client.connect();



var cj1 = new CronJob('*/4 * * * * *', function() {
  console.log('Checking occupancy...');
  checkCoOccupancy();
}, null, true, 'Asia/Singapore');

var cj2 = new CronJob('*/2 * * * * *', function() {
  console.log('Updating tree growths...');
  growTrees();
}, null, true, 'Asia/Singapore');

var cj3 = new CronJob('*/90 * * * * *', function() { // make this 100s
  console.log('Planting trees...');
  plantTrees();
}, null, true, 'Asia/Singapore');


var checkCoOccupancy = function(){
	client.query('SELECT m.id, m.capacity, m.name, u.count AS count, u.count::float / m.capacity::float AS occupancy FROM meeting_rooms m, (SELECT meeting_room, COUNT(*) FROM users GROUP BY meeting_room) u WHERE u.meeting_room = m.id;', [], function(err, result){
		result.rows.forEach(function(r){
			// for each user in the meeting room
			console.log('Room "' + r['name'] + '" has ' + r['count'] + '/' + r['capacity'] + ' people. Updating tree growth rates to ' + r['occupancy'] + '.');
			client.query('SELECT u.id user_id, t.id tree_id FROM users u, trees t where meeting_room = $1 AND u.id = t.user;', [r.id], function(err, res){
				var user_ids = [];
				res.rows.forEach(function(r_){
					user_ids.push(r_['user_id']);
				});
				if (user_ids.length > 0){
					client.query('UPDATE trees t SET curr_growth_rate = ' + r['occupancy'] + ' WHERE t.user IN (' + user_ids.join(',') + ');', function(err, res){});
				} else {
					console.log('what')
				}
				
			});
		});
	});
}

var growTrees = function(){
	client.query('UPDATE trees SET lvl_growth = lvl_growth + (curr_growth_rate / 90.0) WHERE plant_date IS NULL;'); // growth_rate = actual_rate / (check interval/total interval)
}


var chooseTreePosition = function(user_id, x, y, response) {
	client.query('SELECT 1 FROM trees t, users u, users u1 \
		WHERE u.department = u1.department \
		AND plant_date IS NOT NULL AND u1.id = $1 \
		AND x = $2 AND y = $3 \
		;', [user_id, x, y], function(err, res){
			if (res.rows.length > 0){
				response.send('nok')
			} else {
				client.query('UPDATE trees SET plant_date=now(), x = ' + x + ', y = ' + y + ';');
				response.send('ok')
			}
		});
}


var checkOccupied = function(coordinates, new_coords){
	var occ = false;
	coordinates.forEach(function(old_coord){
		if (old_coord.x == new_coords.x && old_coord.y == new_coords.y)
			occ = true;
	})
	return occ;
}

var generatePosition = function(max_coord){
	return {'x': Math.floor(Math.random() * max_coord) + 1, 'y': Math.floor(Math.random() * max_coord) + 1};
}

var plantTrees = function(){
	// for each department

	var q = client.query('SELECT id FROM departments;', [], function(err, res){
		// plant all not-planted trees
		res.rows.forEach(function(dept){
			// get all the planted trees of the department
			client.query('SELECT t.id, t.x, t.y FROM trees t, users u \
				WHERE u.department = $1 \
				AND t.plant_date IS NOT NULL;', [dept['id']], function(err, res){	
				var coordinates = [];
				var num_trees = 0;

				res.rows.forEach(function(tree){
					coordinates.push({'x': tree.x, 'y': tree.y});
					num_trees += 1;
				});		

				client.query('SELECT t.id, t.x, t.y, u.id as userid FROM trees t, users u \
					WHERE u.department = $1 \
					AND u.id = t.user \
					AND t.plant_date IS NULL;', [dept['id']], function(err, res){
						res.rows.forEach(function(t){
							max_coord = Math.round(Math.sqrt(num_trees * 3));
							coord = generatePosition(max_coord);
							while(checkOccupied(coordinates, coord)){
								coord = generatePosition(max_coord);
							}
							coordinates.push(coord);
							num_trees += 1;
							client.query('UPDATE trees SET plant_date = NOW(), x = ' + coord.x + ', y = ' + coord.y + ' WHERE id = ' + t.id + ';');
							client.query('INSERT INTO trees("user") VALUES (' + t.userid + ');');

						});
					});
				});
		});

		
		
	})

}

var associate = function (staffid, beaconid) {
	if (beaconid == null){ //disassociating
		client.query('SELECT meeting_room FROM users WHERE id = $1', [staffid], function(err, result){
			client.query('UPDATE users SET meeting_room = NULL', [result.rows[0].meeting_room]);
		});
	} else {
		client.query('UPDATE meeting_rooms m SET occupancy = occupancy + 1 WHERE m.id = $1', [beaconid]);
		client.query('UPDATE users SET meeting_room = $1 WHERE id = $2', [beaconid, staffid]);
	}
	return true;
}

app.get('/associate', function (req, res) {
	var staffid = req.param('staffid');
	var beaconid = req.param('beaconid');
	if (typeof(staffid) !== "undefined" && typeof(beaconid) !== "undefined"){
		var success = associate(staffid, beaconid);
		if (success)
			res.send('ok');
		else
			res.send('nok');
	}
	else
		res.send('nope');
});

app.get('/plant', function (req, res) {
	var staffid = req.param('staffid');
	var x = req.param('x');
	var y = req.param('y');
	if (typeof(staffid) !== "undefined" && typeof(x) !== "undefined" && typeof(y) !== "undefined"){
		chooseTreePosition(staffid, x, y, res);
	}
	else
		res.send('nope');
});


app.get('/get_tree', function(req, resp){
	var staffid = req.param('staffid');
	if (typeof(staffid) !== "undefined")
		client.query('SELECT * FROM trees t WHERE t.user = ' + staffid + ' AND plant_date IS NULL;', function(err, res){
			console.log(err)
			if (!err && res.rows.length > 0)
				resp.json({'lvl_growth': res.rows[0].lvl_growth, 'curr_growth_rate': res.rows[0].curr_growth_rate});
			else
				resp.json({'success': false});
		});

});


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})