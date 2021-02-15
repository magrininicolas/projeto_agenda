const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contatoController = require('./src/controllers/contatoController')

// Rotas Home
route.get('/home', homeController.index);

// Rotas Login
route.get('/', loginController.index); 
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

// Rotas Contato
route.get('/contato/', contatoController.index);
route.post('/contato/register', contatoController.register);
route.get('/contato/:id', contatoController.editIndex);
route.post('/contato/edit/:id', contatoController.edit);
route.get('/contato/delete/:id', contatoController.delete);

module.exports = route;