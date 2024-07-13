const router = require('express').Router();
const auth = require("../middlewares/auth");
const { Job, User, Recruiter } = require('../models');

router.get('/', async (req, res) => {
    try {
        let user = null;
        if (req.session.loggedIn) {
            const userData = await User.findOne({ where: { id: req.session.user_id } });
            user = userData.get({ plain: true });
        }

        const jobData = await Job.findAll({ include: [{ model: Recruiter }] });
        const jobs = jobData.map(job => job.get({ plain: true }));
        res.render("home-page", { user, jobs, loggedIn: req.session.loggedIn });
    } catch (error) {
        console.error("ERROR occurs while displaying data on home page\n", error);
        res.status(500).json({ message: "Intenal error, please try again later" });
    }
});

router.get("/login", async (req, res) => {
    res.render("login");
});

router.get("/signup", async (req, res) => {
    res.render("sign-up");
});

router.get("/profile", auth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id);
        const user = userData.get({ plain: true });
        res.render("profile", { user, loggedIn: req.session.loggedIn });
    } catch (error) {
        console.log(("Error occurs while accessing profile\n", error));
        res.status(500).json({ message: "Internal error, please try again later" });
    }
});

router.get("/applications", auth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id);
        const user = userData.get({ plain: true });
        const jobApplicationData = await Job.findAll({ 
            where: { user_id: req.session.user_id },
            include: [{model: Recruiter}]
        });
        const jobApplications = jobApplicationData.map(jobApplication => jobApplication.get({ plain: true }));
        console.log("jobApplications :>>", jobApplications);
        res.render("applications", { user, jobApplications, loggedIn: true });
    } catch (error) {
        console.log("ERROR occurs while fetching job applications\n", error);
        res.status(500).json({ message: "Internal error, please try again later" });
    }
});

module.exports = router;