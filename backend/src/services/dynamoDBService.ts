import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {PutCommand, GetCommand, UpdateCommand, ScanCommand, BatchWriteCommand} from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import dotenv from "dotenv";
import {AwsCredentialIdentityProvider} from "@aws-sdk/types";
import {UpdateCommandInput, UpdateCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/UpdateCommand";
import {PutCommandInput, PutCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/PutCommand";
import {GetCommandInput, GetCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/GetCommand";
import {ScanCommandInput, ScanCommandOutput} from "@aws-sdk/client-dynamodb/dist-types/commands";
import {BatchWriteCommandInput, BatchWriteCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands";

dotenv.config()

const profile: string = process.env.PROFILE!
const region: string = process.env.REGION!

const credentials: AwsCredentialIdentityProvider = fromIni({profile: profile});

export const dynamoDbClient: DynamoDBClient = new DynamoDBClient({
    credentials,
    region: region
})

export const getItem = async (params: GetCommandInput): Promise<GetCommandOutput> => {
    const command: GetCommand = new GetCommand(params)
    return await dynamoDbClient.send(command)
}

export const scanItems = async (params: ScanCommandInput):Promise<ScanCommandOutput>=> {
    const command: ScanCommand = new ScanCommand(params)
    return await dynamoDbClient.send(command)
}

export const putItem = async (params: PutCommandInput): Promise<PutCommandOutput> => {
    const command: PutCommand = new PutCommand(params)
    return await dynamoDbClient.send(command)
}

export const batchPut = async (params: BatchWriteCommandInput): Promise<BatchWriteCommandOutput> => {
    const command: BatchWriteCommand = new BatchWriteCommand(params)
    return await dynamoDbClient.send(command)
}

export const updateItem = async (params: UpdateCommandInput): Promise<UpdateCommandOutput> => {
    const command: UpdateCommand = new UpdateCommand(params)
    return await dynamoDbClient.send(command)
}