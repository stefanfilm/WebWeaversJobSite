const { User } = require("../../models");

const router = require("express").Router();

router.post("/signup", async (req, res) => {
    try {
        const usename = await User.findOne({ where: { username: req.body.username } });
        const email = await User.findOne({ where: { email: req.body.email } });
        if (usename) {
            res.status(400).json({ message: "Username is already taken" });
            return;
        }
        if (email) {
            res.status(400).json({ message: "Email is already taken" });
            return;
        }
        const user = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.usename,
            password: req.body.password,
            email: req.body.email,
            job_title: req.body.job_title,
            user_img: req.body.user_img
        });

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.user_id = user.id;
            res.status(200).json({ message: "Logged in" });
        });
    }catch(error) {
        console.log("ERROR occurs while sign up\n", error);
        res.status(500).json({ message: "Internal error, please try again later" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });

        if (!user || !user.checkPassword(req.body.password)) {
            res.status(404).json({ message: "Username or Password is incorrect" });
            return;
        }

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.user_id = user.id;
            res.status(200).json({ message: "Logged in" });
        });
    } catch (error) {
        console.log("ERROR occurs while login\n", error);
        res.status(500).json({ message: "Internal error, please try again later" });
    };
});

router.post("/logout", async (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;