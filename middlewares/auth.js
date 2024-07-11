const auth = (req, res, next) => {
    if(!req.session.loggIn){
        res.render("/login");
        return;
    };

    next();
}

module.exports = auth;