const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
	extended: false
}));

app.use('/appointments', require('./routers/appointments.routes'));

app.listen(3000, () => console.log('App express listen in port: 3000'));