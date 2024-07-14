const router = require('express').Router();
const { application } = require('express');
const auth = require("../middlewares/auth");
const { Job, User, Recruiter, Application } = require('../models');

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

        const jobApplicationData = await Application.findAll({
            where: { user_id: req.session.user_id },
            attributes: ["job_id"]
        });

        const jobApplications = []
        for (let jobApplication of jobApplicationData) {
            const jobData = await Job.findOne({
                where: { id: jobApplication.job_id },
                include: [{ model: Recruiter }]
            });
            jobApplications.push(jobData.get({ plain: true }));
        }

        console.log("jobApplications :>>", jobApplicationData);
        console.log("jobApplications.job :>>", jobApplicationData.job);
        res.render("applications", { user, jobApplications, loggedIn: true });
    } catch (error) {
        console.log("ERROR occurs while fetching job applications\n", error);
        res.status(500).json({ message: "Internal error, please try again later" });
    }
});

router.get("/job/:id", auth, async (req, res) => {
    try {
        const jobData = await Job.findOne({ where: { id: req.params.id }, include: [{ model: Recruiter }] });
        const job = jobData.get({ plain: true });
        const applicationData = await Application.findOne({ where: { user_id: req.session.user_id, job_id: req.params.id } });
        let isApplied = false;
        if (applicationData) {
            isApplied = true;
        }
        res.render("job", { job, loggedIn: true, isApplied: isApplied });
    } catch (error) {
        console.log("ERROR occurs while fetching job data from /job/:id\n", error);
        res.status(200).json({ message: "Internal error, please try again" });
    }
});

module.exports = router;