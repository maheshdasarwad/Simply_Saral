
const express = require('express');
const router = express.Router();

router.get("/login", (req, res) => {
    res.render("./pages/login_Page.ejs");
});

router.get("/signup", (req, res) => {
    res.render("./pages/SignUpPage.ejs");
});

router.post("/login", (req, res) => {
    let {username, password} = req.body;
    console.log(username, password);
    res.send("Successfully login");
});

module.exports = router;
