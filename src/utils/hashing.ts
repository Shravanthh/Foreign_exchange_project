import bcrypt from "bcrypt";
const saltRounds: number = 13;
export const hashingPassword = ({password}: {password:string}): string => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return  bcrypt.hashSync(password, salt);
}

export const checkPassword = ({password, hashPassword}: {password: string, hashPassword: string}): boolean => {
    return bcrypt.compareSync(password, hashPassword)
}