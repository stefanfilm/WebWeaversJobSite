const isRecruiter = (req, res, next) => {
    if(!req.session.isRecruiter)
        return res.status(400).json({message: "You don't dont have permission to use this feature"});

    next();
}