import express, {Express} from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import currencyRoutes from "./routes/currencyRoutes";

dotenv.config()

const app:Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/currencies', currencyRoutes)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});