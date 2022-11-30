import express from "express";
import userController from "../controller/userController";

const router = express.Router();

router.route("/").post(userController.createUser);
router.route("/validate").get(userController.validateUser);
router.route("/all").get(userController.getUser);
router.route("/check").post(userController.adminPassportCheck);
router.route("/login").post(userController.userLogin);
router.route("/authPass/:id").post(userController.authPasswordCron);
router.route('/myPass').patch(userController.createPermanentPassword)



module.exports = router;



