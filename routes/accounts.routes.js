import express from "express";
const router = express.Router();
import accountController from "../controllers/account.controller.js";

router.post("/", accountController.createAccount);
router.get("/", accountController.getAccount);
router.get("/:id", accountController.getIdAccount);
router.delete("/:id", accountController.accountDelete);
router.put("/", accountController.accountPut);
router.patch("/updateBalance", accountController.accountPatch);

router.use((err, req, res, next) => {
  global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
