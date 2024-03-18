import express, {Express} from "express";
import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import bodyParser from 'body-parser';

const credentials = fromIni({ profile: 'aws-sandbox' });

const dynamoDbClient = new DynamoDBClient({
    credentials,
    region: 'us-east-1'
});
dotenv.config()

const app:Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("working")
})

app.get('/currency/:currencyCode', async (req, res) => {
    const params = {
        TableName: 'shravanth-foreign-exchange-rates',
        Key: { currencyCode: req.params.currencyCode },
    };

    try {
        const command = new GetCommand(params);
        const data = await dynamoDbClient.send(command);
        res.status(200).send(data.Item);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/currency', async (req, res) => {
    const { currencySymbol, currencyCode, displayName, rateAgainstUSD } = req.body;

    const params = {
        TableName: 'shravanth-foreign-exchange-rates',
        Item: {
            currencyCode,
            currencySymbol,
            displayName,
            rateAgainstUSD,
            lastUpdatedAt: Math.floor(Date.now())
        }
    };

    try {
        const command = new PutCommand(params);
        await dynamoDbClient.send(command);
        res.status(201).send({ message: 'Item created successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.patch('/currency/:currencyCode/rate', async (req, res) => {
    const { rateAgainstUSD } = req.body;
    const { currencyCode } = req.params;

    const params = {
        TableName: 'shravanth-foreign-exchange-rates',
        Key: { currencyCode },
        UpdateExpression: 'set rateAgainstUSD = :r, lastUpdatedAt = :t',
        ExpressionAttributeValues: {
            ':r': rateAgainstUSD,
            ':t': Math.floor(Date.now())
        }
    };

    try {
        const command = new UpdateCommand(params);
        const data = await dynamoDbClient.send(command);
        res.status(200).send({ message: 'Item updated successfully', updatedAttributes: data.Attributes });
    } catch (err) {
        res.status(500).send(err);
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});