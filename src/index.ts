import express, {Express} from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import currencyRoutes from "./routes/currencyRoutes";
import authenticationRoutes from "./routes/authenticationRoutes";
import cookieParser from 'cookie-parser';
import {isAuthenticated} from "./controllers/authenticationController";

dotenv.config()

const app:Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/authentication', authenticationRoutes)
app.use('/currencies', isAuthenticated, currencyRoutes)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});