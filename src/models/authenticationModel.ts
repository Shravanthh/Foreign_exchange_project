export type SignUp = {
    userName: string,
    name: string,
    password: string
}

export type Login = {
    userName: string,
    password: string
}

export type UserData = {
    userName: string,
    name: string,
    password: string
}

export type SessionDetails = {
    sessionId: string,
    expiresAt: number,
    userName: string
}