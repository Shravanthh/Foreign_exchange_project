import {Login, SessionDetails, SignUp, UserData} from "../models/authenticationModel";
import {checkPassword, hashingPassword} from "../utils/hashing";
import {getItem, putItem} from "./dynamoDBService";
import {GetCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/GetCommand";
import { v4 as uuidV4 } from 'uuid';
import {createUserSession} from "../utils/authentication";
import {getCurrentEpochPlusOneDay, isExpired} from "../utils/utils";

const userTable: string = process.env.USER_TABLE!
const sessionTable: string = process.env.SESSION_TABLE!

export const signUp = async ({signUpRequest}: {signUpRequest: SignUp}): Promise<string> => {
    signUpRequest.password = hashingPassword({password: signUpRequest.password})
    await putItem({ TableName: userTable, Item: signUpRequest });
    return signUpRequest.userName
}

export const login = async ({loginRequest}:{loginRequest:Login})=> {
    const userName: string = loginRequest.userName
    const  userData: UserData | undefined = await getUser(userName);
    const sessionId: string = uuidV4();
    const expiresAt: number = getCurrentEpochPlusOneDay()
    const userSessionData = createUserSession({sessionId, expiresAt,userName})
    if(!userData){
        throw new Error("User not found");
    }
    const passwordValid = checkPassword({password: loginRequest.password, hashPassword: userData.password})
    if(!passwordValid){
        throw new Error("Invalid password");
    }
    await putItem({TableName:sessionTable, Item: userSessionData})
    return sessionId;
}

export const getUser = async (userName: string): Promise< UserData | undefined> => {
    const params = {
        TableName: userTable,
        Key: { userName },
    };
    try {
        const item: GetCommandOutput = await getItem(params);
        return item.Item as UserData
    } catch (error) {
        console.error("Failed to get currency data:", error);
        throw error;
    }
};

export const isAuthorised = async (sessionId: string) => {
    const sessionDetail: SessionDetails = await getSessionDetails(sessionId);
    if(!sessionDetail){
        throw new Error("Failed to authenticate")
    }
    if(isExpired(sessionDetail.expiresAt)){
        throw new Error("session is expired")
    }
    return true
}

export const getSessionDetails = async (sessionId: string): Promise<SessionDetails> => {
    const params = {
        TableName: sessionTable,
        Key: { sessionId },
    };
    try {
        const item: GetCommandOutput = await getItem(params);
        return item.Item as SessionDetails
    } catch (error) {
        console.error("Failed to get currency data:", error);
        throw error;
    }
}