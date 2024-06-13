import {CurrencyModel} from "../models/currencyModel";
import {batchPut, getItem, putItem, scanItems, updateItem} from "./dynamoDBService";
import dotenv from "dotenv";
import {GetCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/GetCommand";
import {UpdateCommandInput, UpdateCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/UpdateCommand";
import {ScanCommandInput, ScanCommandOutput} from "@aws-sdk/client-dynamodb/dist-types/commands";

dotenv.config()
const tableName: string = process.env.CURRENCY_EXCHANGE_RATES!
export const getCurrencyEntries = async (currencyCode: string):Promise<CurrencyModel> => {
    const params = {
        TableName: tableName,
        Key: { currencyCode },
    };

    try {
        return await getItem(params).then(data => data.Item as CurrencyModel);
    } catch (error) {
        console.error("Failed to get currency data:", error);
        throw error;
    }
};

export const getAllCurrencyEntries = async(): Promise<ScanCommandOutput> => {
    const params: ScanCommandInput = {
        TableName: tableName
    };
    return await scanItems(params);
}

export const convertCurrency = async (sourceCurrencyCode: string, destinationCurrencyCode: string, conversionQuantity: number): Promise<object> => {
    try {
        const sourceData: CurrencyModel = await getCurrencyEntries(sourceCurrencyCode);
        const destinationData: CurrencyModel = await getCurrencyEntries(destinationCurrencyCode);

        if (!sourceData || !destinationData) {
            throw new Error("Currency data not found");
        }
        const latestDate = destinationData.lastUpdatedAt
        const amountInUSD = conversionQuantity / sourceData.rateAgainstUSD;
        const conversionRate = (amountInUSD * destinationData.rateAgainstUSD).toFixed(2);
        return {conversionQuantity, sourceData, destinationData, conversionRate, latestDate}
    } catch (error) {
        console.error("Currency conversion failed:", error);
        throw error;
    }
};

export const createCurrencyEntry = async (currency: CurrencyModel): Promise<CurrencyModel> => {
    currency.lastUpdatedAt = Math.floor(Date.now());
    await putItem({ TableName: tableName, Item: currency });
    return currency;
};

export const batchCreateCurrenciesEntries = async (currencies: CurrencyModel[]): Promise<CurrencyModel[]> => {
    const putRequests = currencies.map(currency => ({
        PutRequest: { Item: { ...currency, lastUpdatedAt: Math.floor(Date.now()) } }
    }));
    await batchPut({ RequestItems: { [tableName]: putRequests } });
    return currencies;
};

export const updateCurrencyRateEntry = async (rateAgainstUSD: string, currencyCode: string):Promise<UpdateCommandOutput> => {
    const params: UpdateCommandInput = {
        TableName: tableName,
        Key: { currencyCode },
        UpdateExpression: 'set rateAgainstUSD = :r, lastUpdatedAt = :t',
        ExpressionAttributeValues: {
            ':r': rateAgainstUSD,
            ':t': Math.floor(Date.now())
        },
        ReturnValues: "ALL_NEW"
    };
    return await updateItem(params)
}