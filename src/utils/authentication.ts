import { SessionDetails } from "../models/authenticationModel";

export const createUserSession = ({ sessionId, expiresAt, userName }: { sessionId: string, expiresAt: number, userName: string }): SessionDetails => ({
    sessionId: sessionId,
    expiresAt: expiresAt,
    userName: userName
});
