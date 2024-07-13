const { User } = require("../../models");
const upload = require("../../middlewares/imgUpload");

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
            user_img: "https://drive.google.com/thumbnail?id=1GhnJzUBuK-Qartzz3tjo8h60xHNtQtuT&sz=1000"
        });

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.user_id = user.id;
            res.status(200).json({ message: "Logged in" });
        });
    } catch (error) {
        console.log("ERROR occurs while sign up\n", error);
        res.status(500).json({ message: "Internal error, please try again later" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });

        console.log("username :>> ", req.body.username);
        console.log("password :>> ", req.body.password);
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

router.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    const imgUrl = `/uploads/${req.file.filename}`;

    try {
        await User.update({ user_img: imgUrl }, { where: { id: req.session.user_id } });
        res.status(200).json({ imgUrl, message: "Upload imgage successfully" });
    } catch (error) {
        console.log("ERROR occurs while uploading image");
        res.status(500).json("Internal error, please try again later");
    }
});

router.post("/profile", async (req, res) => {
    try {
        console.log("PROFILE");
        console.log("req.body.first_name", req.body.first_name);
        console.log("req.body.last_name", req.body.last_name);
        await User.update({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            job_title: req.body.job_title
        }, {
            where: { id: req.session.user_id }
        });
    }catch(error) {
        console.log("ERROR occurs while updating profile");
        res.status(500).json("Internal error, please try again later");
    }

});

module.exports = router;