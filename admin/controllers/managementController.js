
const express = require('express');

const renderManagementPage = (req, res) => {
    res.render("./pages/ManagementPage.ejs");
};

module.exports = {
    renderManagementPage
};
