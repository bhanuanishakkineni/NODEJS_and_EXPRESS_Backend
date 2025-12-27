import express from "express";
import { addToWatchList, deleteFromWatchList, updateWatchList } from "../controllers/watchListController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequestMiddleware } from "../middleware/validateRequestMiddleware.js";
import { addToWatchListSchema } from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequestMiddleware(addToWatchListSchema), addToWatchList);
router.put("/:id", updateWatchList);
router.delete("/:id", deleteFromWatchList);

export default router;