const router = require('express').Router();
const auth = require("../middlewares/auth");
const { Job, User } = require('../models');

router.get('/', async (req, res) => {
    try {
        const jobs = await Job.findAll()
        res.status(200).json(jobs)
    } catch (error) {
        console.error("ERROR occurs while displaying data on home page\n", error);
        res.status(500).json({ message: "Intenal error, please try again later" });
    }
});

router.get("/login", auth, async (req, res) => {
    res.render("login");
});

module.exports = router;