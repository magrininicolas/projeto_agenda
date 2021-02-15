require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const {
    middlewareGlobal,
    checkCsrfErr,
    csrfMiddleware
} = require('./src/middlewares/middleware')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const sessionOptions = session({
    secret: 'segredokk',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(helmet());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(path.resolve(__dirname, 'public')));

app.use(sessionOptions);
app.use(flash());

mongoose.connect(process.env.CONNECTIONSTRING, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    })
    .then(() => {
        app.emit('pronto');
    })
    .catch(e => console.log(e));

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs')

app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfErr);
app.use(csrfMiddleware)
app.use(routes);

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar: http://localhost:3000');
        console.log('Server executando na porta 3000');
    });
})