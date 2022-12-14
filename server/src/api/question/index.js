const router = require("express").Router();
const questionController = require("./question.controller");
const upload = require("../../middleware/uploadFile");
const { verifyToken } = require("../../middleware/verifyToken");

router.post("/upload", upload, questionController.uploadImage);
router.get("/", questionController.getAllQuestion);
router.get("/:id/detail", questionController.getQuestionWithID);
router.get("/user/", verifyToken, questionController.getQuestionWithUserID);
router.post("/add", verifyToken, questionController.addQuestion);
router.delete("/:id/delete", verifyToken, questionController.deleteQuestion);
router.patch("/:id/modify", verifyToken, questionController.modifyQuestion);
router.post("/:id/up-vote", verifyToken, questionController.upVoteQuestion);
router.post("/:id/down-vote", verifyToken, questionController.downVoteQuestion);
router.get("/:id/reply", questionController.getAllReply);
router.post("/:id/reply/add", verifyToken, questionController.addReply);
router.delete("/reply/:id/delete", verifyToken, questionController.deleteReply);
router.patch("/reply/:id/modify", verifyToken, questionController.modifyReply);
router.post("/reply/:id/up-vote", verifyToken, questionController.upVoteReply);
router.post(
	"/reply/:id/down-vote",
	verifyToken,
	questionController.downVoteReply
);
router.get("/catalogue", questionController.getCatalogue);
router.get("/catalogue/:category", questionController.getQuestionWithCategory);
module.exports = router;
