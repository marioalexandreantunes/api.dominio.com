import express from "express";
import { postCadastro, getLogin, getCadastros, updateCadastro, getSuperUser } from "../../controllers/cadastro.js";
import isAuthorized from '../../middleware/auth.js'

const router = express.Router();

router.post("/createsuperuser", getSuperUser);

router.post("/login", getLogin);

router.post("/cadastro", isAuthorized, postCadastro);

router.get("/cadastros", isAuthorized, getCadastros);

router.put("/cadastro/:uuid", isAuthorized, updateCadastro);

export default router;