const ObjectID = require('mongodb').ObjectID;
const db = require('../db');

module.exports = Model;

function Model(data, validations = [], visible = [], collection){
	let exportables = visible.concat(['_id']);
	let self = this;
	
	Object.assign(self, data, {
		_id: data._id || null,
		errors: []
	});
	
	// methods
	self.valid = valid;
	self.save = save;
	self.update = update;
	self.toObject = toObject;
	
	let validationsMethods = {
		date: _validDate,
		string: _validString
	}
	
	/**
	 * Valid the model based on the validations
	 * @returns {boolean}
	 */
	function valid(){
		let valid = true;
		
		for(let key in validations){
			let validation = () => true;
			if(typeof validations[key].validation === 'function') validation = validations[key].validation;
			else if(validationsMethods[validations[key].validation]) validation = validationsMethods[validations[key].validation];
			
			let value = self[key];
			if(!validation(value)){
				if(validations[key].required){
					self.errors.push(`Required ${key}: "${value}".`);
					valid = false;
				}
				else self.errors.push(`Invalid ${key}: "${value}".`);
			}
		}
		
		return valid;
	}
	
	/**
	 * Save the reservation in mongodb
	 * @param {Boolan} update
	 * @returns {Promise.<TResult>}
	 */
	function save(){
		let data = toObject();
		
		// save the new reservation
		return new Promise((resolve, reject) => {
			db[collection].insert(data, {w: 1}, (err, data) => {
				if(err) return reject(err);
				self._id = data.ops[0] ? data.ops[0]._id : null;
				resolve(data);
			});
		});
	}
	
	/**
	 * Update the model
	 * @returns {Promise}
	 */
	function update(){
		let data = toObject(true);
		
		return new Promise((resolve, reject) => {
			let query = {_id: new ObjectID(data._id)};
			delete data._id;
			
			db[collection].findOneAndUpdate(query, {$set: data}, {returnOriginal: false}, (err, results) => {
				if(err) return reject(err);
				resolve(results.value);
			});
		});
	}
	
	/**
	 * Get the model as an object
	 * @param {Boolean} clean
	 * @returns {Object}
	 */
	function toObject(clean = false){
		let data = {};
		exportables.forEach(key => {
			if(clean && self[key]) data[key] = self[key];
			else data[key] = self[key];
		});
		return data;
	}
	
	function _validDate(value){
		return true;
	}
	
	function _validString(value){
		return !!value;
	}
}