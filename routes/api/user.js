const { User } = require("../../models");

const router = require("express").Router();

router.post("/login", async (req, res) => {
    const user = await User.findOne({where: {username: req.body.username}});

    if(!user || !user.checkPassword(req.body.password)){
        res.status(404).json({message: "Username or Password is incorrect"});
        return;
    }

    
});