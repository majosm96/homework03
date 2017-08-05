const Model = require('./model');

const VALIDATIONS = {
	date: {
		required: true,
		validation: 'date'
	},
	first_name: {
		required: true,
		validation: 'string'
	},
	last_name: {
		required: true,
		validation: 'string'
	},
	deparment: {
		required: true,
		validation: (value) => {
			console.log('custom validation!', value);
			return true;
		}
	}
};

const EXPORTABLES = ['date', 'first_name', 'last_name', 'deparment'];

module.exports = Appointment;

function Appointment(data){
	var self = this;
	
	Object.assign(data, {
		date: data.date || new Date(),
		first_name: data.first_name || '',
		last_name: data.last_name || '',
		deparment: data.deparment || '',
	});
	
	Object.assign(self, new Model(data, VALIDATIONS, EXPORTABLES, 'appointments'));
	
}