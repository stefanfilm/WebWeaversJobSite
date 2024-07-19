const { User, Job, Application, Recruiter } = require("../../models");
const upload = require("../../middlewares/imgUpload");

const router = require("express").Router();

router.post("/signup", async (req, res) => {
    try {
        const { username, email, isRecruiter, company_name, location, first_name, last_name, password, job_title } = req.body;
        let isUsernameExist, isEmailExist, newUser;

        if (isRecruiter) {
            isUsernameExist = await Recruiter.findOne({ where: { username } });
            isEmailExist = await Recruiter.findOne({ where: { email } });
        } else {
            isUsernameExist = await User.findOne({ where: { username } });
            isEmailExist = await User.findOne({ where: { email } });
        }

        if (isUsernameExist)
            return res.status(400).json({ message: "Username is already taken" });

        if (isEmailExist)
            return res.status(400).json({ message: "Email is already taken" });

        if (isRecruiter) {
            newUser = await Recruiter.create({
                company_name,
                location,
                username,
                password,
                email,
                img: "https://drive.google.com/thumbnail?id=1GhnJzUBuK-Qartzz3tjo8h60xHNtQtuT&sz=1000"
            });
        } else {
            newUser = await User.create({
                first_name,
                last_name,
                username,
                password,
                email,
                job_title,
                img: "https://drive.google.com/thumbnail?id=1GhnJzUBuK-Qartzz3tjo8h60xHNtQtuT&sz=1000"
            });
        }

        req.session.save(() => {
            req.session.isUser = !isRecruiter;
            req.session.isRecruiter = isRecruiter;
            req.session.loggedIn = true;
            req.session.user_id = newUser.id;
            res.status(200).json({ message: "Logged in" });
        });
    } catch (error) {
        console.log("ERROR occurs while sign up\n", error);
        res.status(500).json({ message: "Internal error, please try again later" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password, isRecruiter } = req.body;
        console.log("isRecruiter:>> ", isRecruiter);
        let user;
        if (isRecruiter)
            user = await Recruiter.findOne({ where: { username } });
        else
            user = await User.findOne({ where: { username } });

        if (!user || !user.checkPassword(password)) {
            res.status(401).json({ message: "Username or Password is incorrect" });
            return;
        }

        req.session.save(() => {
            req.session.isRecruiter = isRecruiter;
            // console.log("req.session.isRecruiter :>>", req.session.isRecruiter);
            req.session.isUser = !isRecruiter;
            req.session.loggedIn = true;
            // console.log("req.session.isUser :>>", req.session.isUser);
            req.session.user_id = user.id;
            res.status(200).json({ message: "Logged in" });
        });
    } catch (error) {
        console.log("ERROR occurs while login\n", error);
        res.status(500).json({ message: "Internal error, please try again later" });
    };
});

router.post("/logout", async (req, res) => {
    if (req.session) {
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
        if (req.session.isRecruiter)
            await Recruiter.update({ img: imgUrl }, { where: { id: req.session.user_id } });
        else
            await User.update({ img: imgUrl }, { where: { id: req.session.user_id } });

        res.status(200).json({ imgUrl, message: "Upload imgage successfully" });
    } catch (error) {
        console.log("ERROR occurs while uploading image");
        res.status(500).json("Internal error, please try again later");
    }
});

router.put("/profile", async (req, res) => {
    try {
        const { first_name, last_name, job_title, company_name, location } = req.body;
        if (req.session.isRecruiter) {
            await Recruiter.update({
                company_name,
                location,
            }, {
                where: { id: req.session.user_id }
            });
        }
        else {
            await User.update({
                first_name,
                last_name,
                job_title
            }, {
                where: { id: req.session.user_id }
            });
        }

        res.status(200).json({ message: "Update success" });
    } catch (error) {
        console.log("ERROR occurs while updating profile");
        res.status(500).json("Internal error, please try again later");
    }
});

router.post("/job/:id", async (req, res) => {
    try {
        await Application.create({
            user_id: req.session.user_id,
            job_id: req.params.id
        });

        res.status(200).json({ message: "Apply job success" });
    } catch (error) {
        console.log("ERROR occurs while applying job\n", error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.post("/newjob", async (req, res) => {
    try {
        await Job.create({
            title: req.body.title,
            job_description: req.body.job_description,
            salary: req.body.salary,
            recruiter_id: req.session.user_id
        });

        res.status(200).json({ message: "new job post is created" });
    } catch (error) {
        console.error("ERROR occurs while creating new job post");
        res.status(500).json({ message: "Internal error" });
    }
});

router.put("/dashboard/edit/job/:id", async (req, res) => {
    try {
        const [updatedRows] = await Job.update({
            title: req.body.title,
            job_description: req.body.job_description,
            salary: req.body.salary
        }, { where: { id: req.params.id } });
        
        if (updatedRows === 0) {
            res.status(404).render("404", {
                isUser: req.session.isUser,
                isRecruiter: req.session.isRecruiter,
                loggedIn: req.session.loggedIn,
            });
            return;
        }

        res.status(200).json({ message: "Edit job post success" });
    } catch (error) {
        console.error("ERROR occurs while modify job post\n", error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.delete("/job/:id", async (req, res) => {
    try {
        const data = req.session.isUser ?
            await Application.findOne({ where: { job_id: req.params.id } }) :
            await Job.findByPk(req.params.id);
        if (!data) {
            res.render("404", {
                isUser: req.session.isUser,
                isRecruiter: req.session.isRecruiter,
                loggedIn: req.session.loggedIn,
            });
            res.status(404).json({ message: "Page was not found" });
            return;
        }
        if (req.session.isUser)
            await Application.destroy({ where: { job_id: req.params.id } });
        else
            await Job.destroy({ where: { id: req.params.id } });

        res.status(200).json({ message: "Cancel application success!!" });
    } catch (error) {
        console.log("ERROR occurs while deleting job application\n", error);
        res.status(500).json({ message: "Cannot find a job with given id" });
    }
});

router.delete("/dashboard/job/:id", async (req, res) => {
    try {
        const job = await Job.destroy({ where: { id: req.params.id } });
        if (!job) return res.status(404).json({ message: "Cannot find a job with given id" });

        res.status(200).json({ message: "Delete job success!!" });
    } catch (error) {
        console.error("ERROR occurs while deleting job\n", error);
        res.status(500).json("Internal error");
    }
});

module.exports = router;