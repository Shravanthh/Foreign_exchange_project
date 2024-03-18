import {Request, Response} from "express";
import dotenv from "dotenv";
import {UpdateCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/UpdateCommand";
import {CurrencyConversion, CurrencyModel} from "../models/currencyModel";
import {ScanCommandOutput} from "@aws-sdk/client-dynamodb/dist-types/commands";
import {
    batchCreateCurrenciesEntries,
    convertCurrency,
    createCurrencyEntry, getAllCurrencyEntries, getCurrencyEntries,
    updateCurrencyRateEntry
} from "../services/currencyService";
import {GetCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/GetCommand";

dotenv.config()

const tableName: string = process.env.CURRENCY_EXCHANGE_RATES!

export const createCurrency = async (req: Request, res: Response): Promise<void> => {
    try {
        const newCurrency: CurrencyModel = req.body;
        const createdCurrency = await createCurrencyEntry(newCurrency);
        res.status(201).send({ message: 'Currency created successfully', createdCurrency });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create currency', error: error });
    }
};

export const batchCreateCurrencies = async (req: Request, res: Response): Promise<void> => {
    try {
        const currencies: CurrencyModel[] = req.body;
        const createdCurrencies = await batchCreateCurrenciesEntries(currencies);
        res.status(201).send({ message: 'Currencies created successfully', createdCurrencies });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create currencies', error: error });
    }
};

export const updateCurrencyRate = async (req:Request, res:Response): Promise<void> => {
    try {
        const { rateAgainstUSD } = req.body;
        const { currencyCode } = req.params;
        const data: UpdateCommandOutput = await updateCurrencyRateEntry(rateAgainstUSD, currencyCode);
        res.status(200).send({ message: 'Item updated successfully', updatedAttributes: data.Attributes });
    } catch (err) {
        res.status(500).send(err);
    }
}


export const getAllCurrency = async (req:Request, res:Response):Promise<void> => {
    try {
        const data: ScanCommandOutput = await getAllCurrencyEntries()
        res.status(200).send(data.Items);
    } catch (err) {
        res.status(500).send(err);
    }
}

export const getCurrency = async (req:Request, res:Response):Promise<void> => {
    try {
        const {currencyCode} = req.params
        const data: GetCommandOutput = await getCurrencyEntries(currencyCode)
        res.status(200).send(data.Item);
    } catch (err) {
        res.status(500).send(err);
    }
}

export const currencyConversion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sourceCurrencyCode, destinationCurrencyCode, conversionQuantity }: CurrencyConversion = req.body;
        const conversionResult = await convertCurrency(sourceCurrencyCode, destinationCurrencyCode, conversionQuantity);
        res.status(200).send(conversionResult);
    } catch (error) {
        console.error("Currency conversion failed:", error);
        res.status(500).send({ message: 'Currency conversion failed', error: error });
    }
}