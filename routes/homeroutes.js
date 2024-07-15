const router = require('express').Router();
const auth = require("../middlewares/auth");
const { Job, User, Recruiter, Application } = require('../models');

router.get('/', async (req, res) => {
    try {
        let user = null;
        let recruiter = null;
        if (req.session.isUser) {
            const userData = await User.findByPk(req.session.user_id);
            user = userData.get({ plain: true });
        }
        if (req.session.recruiter_id) {
            console.log(req.session.recruiter_id);
            const recruiterData = await Recruiter.findByPk(req.session.recruiter_id);
            recruiter = recruiterData.get({ plain: true });
        }
        const loggedIn = !!user || !!recruiter;
        const jobData = await Job.findAll({ include: [{ model: Recruiter }] });
        const jobs = jobData.map(job => job.get({ plain: true }));
        console.log(!!req.session.recruiter_id, loggedIn)
        res.render("home-page", { user, recruiter, jobs, isUser: req.session.isUser, isRecruiter: !!req.session.recruiter_id, isLoggedIn: loggedIn });
    } catch (error) {
        console.error("ERROR occurs while displaying data on home page\n", error);
        res.status(500).json({ message: "Intenal error, please try again later" });
    }
});

router.get("/login", async (req, res) => {
    res.render("login");
});

// router.get("/login/recruiter", async (req, res) => {
//     res.render("login", { isRecruiter: true });
// });

router.get("/signup", async (req, res) => {
    res.render("sign-up", {isRecruiter: false, isUser: false});
});

router.get("/signup/user", async (req, res) => {
    res.render("sign-up", { isUser: true });
});

router.get("/signup/recruiter", async (req, res) => {
    res.render("sign-up", { isRecruiter: true});
})

router.get("/profile", auth, async (req, res) => {
    try {

        let userData;
        if (isUser)
            userData = await User.findByPk(req.session.user_id);
        else
            userData = await Recruiter.findByPk(req.session.user_id);

        const user = userData.get({ plain: true });
        res.render("profile", { user, isUser: req.session.isUser, isRecruiter: req.session.isRecruiter });
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

        res.render("applications", { user, jobApplications, isUser: true });
    } catch (error) {
        console.log("ERROR occurs while fetching job applications\n", error);
        res.status(500).json({ message: "Internal error, please try again later" });
    }
});

router.get("/job/:id", auth, async (req, res) => {
    try {
        const jobData = await Job.findOne({ where: { id: req.params.id }, include: [{ model: Recruiter }] });
        if (!jobData)
            return res.status(404).json({ message: "Cannot find a job with given id" });

        const job = jobData.get({ plain: true });

        let isApplied = false;
        if (req.session.isUser) {
            const applicationData = await Application.findOne({ where: { user_id: req.session.user_id, job_id: req.params.id } });
            if (applicationData) {
                isApplied = true;
            }
        }
        res.render("job", { job, isUser: req.session.isUser, isRecruiter: req.session.isRecruiter, isApplied: isApplied });
    } catch (error) {
        console.log("ERROR occurs while fetching job data from /job/:id\n", error);
        res.status(200).json({ message: "Internal error, please try again" });
    }
});

router.get("/dashboard", auth, async (req, res) => {
    try {
        const recruiterData = await Recruiter.findByPk(req.session.user_id);
        const recruiter = recruiterData.get({ plain: true });
        const jobData = await Job.findAll({ where: { recruiter_id: req.session.user_id } });
        const jobs = jobData.map(job => job.get({ plain: true }));

        res.render("dashboard", { recruiter, jobs, isRecruiter: true });
    } catch (error) {
        console.log("Error occurs while loading recruiter dashboard\n", error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.get("/dashboard/job/:id", auth, async (req, res) => {
    try {
        const jobData = await Job.findByPk(req.params.id);
        const candidateData = await Application.findAll({ where: { job_id: req.params.id }, include: [{ model: User }] });

        if (!jobData || !candidateData) {
            return res.status(404).json({ message: "Cannot data about job with given id" });
        }

        const job = jobData.get({ plain: true });
        const candidates = candidateData.map(candidate => candidate.get({ plain: true }));

        res.render("dashboard-job", { job, candidates, isRecruiter: true });
    } catch (error) {
        console.error("Error occurs while loading /dasboard/job\n", error);
        res.status(500).json({ message: "Internal error" });
    }
});

module.exports = router;