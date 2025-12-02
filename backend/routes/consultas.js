import express from "express";
import {
  getAllConsultas,
  getConsultasByUsuario,
  createConsulta,
  updateConsulta,
  deleteConsulta
} from "../controllers/consultasController.js";

export const router = express.Router();

router.get("/", getAllConsultas);
router.get("/usuario/:id", getConsultasByUsuario);
router.post("/", createConsulta);
router.put("/:id", updateConsulta);
router.delete("/:id", deleteConsulta);