import express, {Express} from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import currencyRoutes from "./routes/currencyRoutes";
import authenticationRoutes from "./routes/authenticationRoutes";
import cookieParser from 'cookie-parser';
import {isAuthenticated} from "./controllers/authenticationController";
import cors from "cors"
import path from "path";

dotenv.config()

const app:Express = express();
const port = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000', 'http://shravanth.evivelabs.com'], credentials: true}));

app.use(express.static(path.join(__dirname, '../../frontend/build/')));

app.use('/authentication', authenticationRoutes)
app.use('/currencies', isAuthenticated, currencyRoutes)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});