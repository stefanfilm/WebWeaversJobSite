const router = require('express').Router();
const { json } = require('sequelize');
const auth = require("../middlewares/auth");
const { Job, User, Recruiter, Application } = require('../models');

router.get('/', async (req, res) => {
    try {
        let user = null;
        if (req.session.isUser) {
            const userData = await User.findByPk(req.session.user_id);
            user = userData.get({ plain: true });
        }
        if (req.session.isRecruiter) {
            const recruiterData = await Recruiter.findByPk(req.session.user_id);
            user = recruiterData.get({ plain: true });
        }

        const jobData = await Job.findAll({ include: [{ model: Recruiter }] });
        const jobs = jobData.map(job => {
            const jobPlain = job.get({ plain: true });
            jobPlain.isHomePage = true;
            return jobPlain;
        });
        res.render("home-page", {
            user,
            jobs,
            isUser: req.session.isUser,
            isRecruiter: req.session.isRecruiter,
            loggedIn: req.session.loggedIn,
        });
    } catch (error) {
        console.error("ERROR occurs while displaying data on home page\n", error);
        res.status(500).json({ message: "Intenal error, please try again later" });
    }
});

router.get("/login", async (req, res) => {
    res.render("login", {
        isUser: req.session.isUser,
        isRecruiter: req.session.isRecruiter,
        loggedIn: req.session.loggedIn
    });
});

router.get("/signup", async (req, res) => {
    console.log("req.session.isUser :>>", req.session.isUser);
    console.log("req.session.isRecruiter :>>", req.session.isRecruiter);
    res.render("sign-up", {
        isUser: req.session.isUser,
        isRecruiter: req.session.isRecruiter,
        loggedIn: req.session.loggedIn
    });
});

router.get("/signup/user", async (req, res) => {
    res.render("sign-up", {
        isUser: true,
        isRecruiter: req.session.isRecruiter,
        loggedIn: req.session.loggedIn
    });
});

router.get("/signup/recruiter", async (req, res) => {
    res.render("sign-up", {
        isUser: req.session.isUser,
        isRecruiter: true,
        loggedIn: req.session.loggedIn
    });
})

router.get("/profile", auth, async (req, res) => {
    try {

        let userData;
        if (req.session.isUser)
            userData = await User.findByPk(req.session.user_id);
        else
            userData = await Recruiter.findByPk(req.session.user_id);

        const user = userData.get({ plain: true });
        res.render("profile", {
            user,
            isUser: req.session.isUser,
            isRecruiter: req.session.isRecruiter,
            loggedIn: req.session.loggedIn
        });
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

        const jobs = [];
        for (let jobApplication of jobApplicationData) {
            const jobData = await Job.findOne({
                where: { id: jobApplication.job_id },
                include: [{ model: Recruiter }]
            });
            jobs.push(jobData.get({ plain: true }));
        }

        res.render("dashboard", {
            user,
            jobs,
            isUser: req.session.isUser,
            isRecruiter: req.session.isRecruiter,
            loggedIn: req.session.loggedIn
        });
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
        let isBelongTo = false;
        if (req.session.isRecruiter) {
            isBelongTo = await Job.findOne({
                where: {
                    id: req.params.id,
                    recruiter_id: req.session.user_id
                }
            }) ? true : false;
        }
        res.render("job", {
            job,
            isUser: req.session.isUser,
            isRecruiter: req.session.isRecruiter,
            loggedIn: req.session.loggedIn,
            isApplied: isApplied,
            isJobPage: true,
        });
    } catch (error) {
        console.log("ERROR occurs while fetching job data from /job/:id\n", error);
        res.status(200).json({ message: "Internal error, please try again" });
    }
});

router.get("/dashboard", auth, async (req, res) => {
    try {
        const userData = await Recruiter.findByPk(req.session.user_id);
        const user = userData.get({ plain: true });
        const jobData = await Job.findAll({ where: { recruiter_id: req.session.user_id } });
        const jobs = jobData.map(job => {
            const jobPlain = job.get({ plain: true })
            jobPlain.isRecruiter = req.session.isRecruiter;
            return jobPlain;
        });

        res.render("dashboard", {
            user,
            jobs,
            isUser: req.session.isUser,
            isRecruiter: req.session.isRecruiter,
            loggedIn: req.session.loggedIn,
        });
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

        res.render("job", {
            job,
            candidates,
            isUser: req.session.isUser,
            isRecruiter: req.session.isRecruiter,
            loggedIn: req.session.loggedIn,
            isBelongTo: true,
        });
    } catch (error) {
        console.error("Error occurs while loading /dasboard/job\n", error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.get("/newjob", auth, (req, res) => {
    res.render("new-job", {
        isUser: req.session.isUser,
        isRecruiter: req.session.isRecruiter,
        loggedIn: req.session.loggedIn
    });
});

router.get("/dashboard/edit/job/:id", async (req, res) => {
    try {
        const jobData = await Job.findByPk(req.params.id);

        if (!jobData) {
            res.status(404).render("404", {
                isUser: req.session.isUser,
                isRecruiter: req.session.isRecruiter,
                loggedIn: req.session.loggedIn,
            });
            return;
        }

        const job = jobData.get({ plain: true });

        if(job.recruiter_id !== req.session.user_id){
            res.status(400).render("400", {
                isUser: req.session.isUser,
                isRecruiter: req.session.isRecruiter,
                loggedIn: req.session.loggedIn,
            });
            return;
        }

        res.render("job-editor", {
            job,
            isUser: req.session.isUser,
            isRecruiter: req.session.isRecruiter,
            loggedIn: req.session.loggedIn
        });
    } catch (error) {
        console.error("ERROR occurs while loading data from /dashboard/edit/job\n", error);
        res.status(500).json({ message: "Internal error" });
    }
});

module.exports = router;