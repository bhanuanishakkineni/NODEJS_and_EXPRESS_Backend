import express from "express";
import { sampleFunc } from "../controllers/sampleController.js";

const sampleRouter = express.Router();

sampleRouter.post("/sampletest", sampleFunc);

export default sampleRouter;