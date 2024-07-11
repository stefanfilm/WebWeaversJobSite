const router = require('express').Router();
const { Job } = require('../models');

router.get('/' , async (req,res) => {
    const jobs = await Job.findAll()
    res.status(200).json(jobs)
}
)

module.exports = router;