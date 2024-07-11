const { User } = require("../../models");

const router = require("express").Router();

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
    }catch(error){
        console.log("ERROR occurs while login\n", error);
        res.status(500).json({message: "Internal error, please try again later"});
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