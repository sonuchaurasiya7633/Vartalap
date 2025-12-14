const express = require("express");
const router = express.Router();

const {createNewMessage,getAllMessages} = require("../controllers/messageContoller");
const {checkAuth} = require("../middlewares/auth");

router.post("/send-message",checkAuth,createNewMessage);
router.get("/get-all-messages/:chatUserId",checkAuth,getAllMessages);


module.exports = router;