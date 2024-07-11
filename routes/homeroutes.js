const router = require('express').Router();
const auth = require("../middlewares/auth");
const { Job, User, Recruiter } = require('../models');

router.get('/', async (req, res) => {
    try {
        let user = null;
        if(req.session.loggedIn)
            user = await User.findOne({where: {id: req.session.user_id}}).get({plain: true});
        const jobData = await Job.findAll({include: [{model: Recruiter}]});
        const jobs = jobData.map(job => job.get({plain: true}));
        res.render("home-page", {user, jobs, loggedIn: req.session.loggedIn});
    } catch (error) {
        console.error("ERROR occurs while displaying data on home page\n", error);
        res.status(500).json({ message: "Intenal error, please try again later" });
    }
});

router.get("/login", auth, async (req, res) => {
    res.render("login");
});

module.exports = router;