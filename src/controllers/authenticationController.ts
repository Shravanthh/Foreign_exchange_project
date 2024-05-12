import {NextFunction, Request, Response} from "express";
import {Login, SignUp} from "../models/authenticationModel";
import {isAuthorised, login, signUp} from "../services/authenticationService";


export const signUpController = async (req: Request, res: Response): Promise<void> => {
    try {
        const signUpRequest: SignUp = req.body;
        const userName = await signUp({signUpRequest});
        res.status(201).send({ message: 'Account Created', userName});
    } catch (error) {
        res.status(500).send({ message: 'Failed Signing in', error: error });
    }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const loginRequest: Login = req.body;
        const sessionId: string = await login({loginRequest});
        res.cookie('sessionToken', sessionId);
        res.status(200).send({message: 'Login successful'})
    } catch (error) {
        res.status(500).send({ message: 'Failed Logging in', error: error });
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies['sessionToken'];
    if (!sessionId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        await isAuthorised(sessionId)
        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(401).json({ message: 'Unauthorized'});
    }
};