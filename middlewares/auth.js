const auth = (req, res, next) => {
    if(!req.session.loggedIn){
        res.render("/login");
        return;
    };

    next();
}

module.exports = auth;