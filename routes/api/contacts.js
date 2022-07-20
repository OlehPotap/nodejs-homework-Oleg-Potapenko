const express = require("express");
// const _ = require("lodash");


const controller = require('../../models/contacts.controller')


const router = express.Router();

// ===================================== middlwares


router.get("/", controller.getAll);

router.get("/:contactId", controller.getById);

router.post("/", controller.postOne);

router.delete("/:contactId",controller.deleteById);

router.put("/:contactId", controller.putOne);

router.patch("/:contactId/favorite",controller.patchOne);

module.exports = router;
