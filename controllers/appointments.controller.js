const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const Appointment = require('../models/appointment.model');

module.exports = {
	getAll,
	create,
	remove,
	getAgenda,
};

function getAll(req, res){
	let stream = db.appointments.find().stream();
	let data = [];
	stream.on('data', appointment => data.push(appointment));
	stream.on('end', () => res.json(data));
	stream.on('error', err => res.json({error: err}));
}

function create(req, res){
	let params = {
		date: req.body.date,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		deparment: req.body.deparment,
	};
	let appointment = new Appointment(params);
	if(!appointment.valid()) return res.json(appointment.errors);
	
	// save the new appointment
	appointment.save().then((data, err) => {
		if(err) return res.json({error: err});
		console.log('data', data);
		res.json(data.ops);
	});
}

/**
 * Remove an appointment base on the id
 * @param {Object} req
 * @param {Object} res
 */
function remove(req, res){
	let id = req.params.appointmentId;
	if(!id) return res.json({error: `Invalid id ${id}`});
	
	let query = {_id: new ObjectID(id)};
	db.appointments.findAndRemove(query, {w: 1}, (err, data) => {
		if(err) return res.json({error: err});
		res.json(data.value || {});
	});
}

/**
 *
 * @param req
 * @param res
 */
function getAgenda(req, res){
	let query = {date: '2017/07/9'};
	let stream = db.appointments.find(query).stream();
	let data = [];
	stream.on('data', appointment => data.push(appointment));
	stream.on('end', () => res.json(data));
	stream.on('error', err => res.json({error: err}));
}