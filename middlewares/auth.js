const auth = (req, res, next) => {
    if(!req.session.loggedIn){
        res.render("login");
        return;
    };

    next();
}

const isRecruiter = (req, res, next) => {
    if (!req.session.isRecruiter) {
        res.status(400).render("400", {
            isUser: req.session.isUser,
            isRecruiter: req.session.isRecruiter,
            loggedIn: req.session.loggedIn,
        });
        return;
    }
    next();
}

const isUser = (req, res, next) => {
    if (!req.session.isUser) {
        res.status(400).render("400", {
            isUser: req.session.isUser,
            isRecruiter: req.session.isRecruiter,
            loggedIn: req.session.loggedIn,
        });
        return;
    }
    next();
}

module.exports = {auth, isRecruiter, isUser};