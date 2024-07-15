const auth = (req, res, next) => {
    if(!req.session.isUser && !req.session.isRecruiter){
        res.render("login");
        return;
    };

    next();
}

module.exports = auth;