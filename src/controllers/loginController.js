const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  if(req.session.user) return res.render('index');
  res.render('login');
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.err.length > 0) {
      req.flash('err', login.err);
      req.session.save(function () {
        return res.redirect('/');
      });
      return;
    }

    req.flash('success', 'Seu usuário foi criado com sucesso.');
    req.session.save(function () {
      return res.redirect('/');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    if (login.err.length > 0) {
      req.flash('err', login.err);
      req.session.save(function () {
        return res.redirect('/');
      });
      return;
    }
    req.flash('success', 'Você logou no sistema');
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect('/home');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
}

exports.logout = function (req, res){
  req.session.destroy();
  res.redirect('/');
}