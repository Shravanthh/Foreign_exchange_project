import express from "express";
import {loginController, signUpController} from "../controllers/authenticationController";

const routes: express.Router = express.Router();

routes.put('/signUp', signUpController);
routes.post('/login',loginController)

export default routes;