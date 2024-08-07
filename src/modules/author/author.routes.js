import { Router } from "express";
import * as auhtors from "./author.controller.js";
const router = Router();
router.post("/addAuthor", auhtors.addAuthor);
router.get("/getAll", auhtors.getAllAuthors);
router.get("/getAnAuthor/:id", auhtors.getAnAuthor);
router.patch("/updateAuthor/:id", auhtors.updateAuthor);
router.delete("/deleteAuthor/:id", auhtors.deleteAuthor);
router.get("/search",auhtors.search);
export default router;
