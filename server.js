const express = require('express');
const app = express();
const serveStatic = require('serve-static');
const axios = require('axios');
const bodyParser = require('body-parser');

app.use(serveStatic(__dirname + '/dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const apiUrl = 'http://5a0c4a196c25030012c335c9.mockapi.io';
let resource = 'todos';

app.get('/todos', (req, res) => {
  axios.get(`${apiUrl}/${resource}`)
    .then(response => res.json(response.data));
});

app.get('/todos/:id', (req, res) => {
  axios.get(`${apiUrl}/${resource}/${req.params.id}`)
    .then(response => res.json(response.data));
});

app.post('/todos', (req, res) => {
  axios.post(`${apiUrl}/${resource}`, req.body)
    .then(response => res.json(response.data));
});

app.delete('/todos/:id', (req, res) => {
  axios.delete(`${apiUrl}/${resource}/${req.params.id}`)
    .then(response => res.json(response.data));
});

app.patch('/todos/:id', (req, res) => {
  axios.patch(`${apiUrl}/${resource}/${req.body.id}`, req.body)
    .then(response => res.json(response.data));
});

app.patch('/todos/complete/:id', (req, res) => {
  axios.patch(`${apiUrl}/${resource}/${req.body.id}`, req.body)
    .then(response => res.json(response.data));
});

setResource = (r) => {
  resource = r;
};


module.exports = app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}.`));