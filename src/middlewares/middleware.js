exports.middlewareGlobal = (req, res, next) => {
    res.locals.err = req.flash('err');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
};

exports.checkCsrfErr = (err, req, res, next) =>{
    if(err){
        return res.render('404');
    }
    next();
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}