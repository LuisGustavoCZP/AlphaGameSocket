import { IUser } from ".";

interface IUserLogin extends IUser {
    id: string
    username: string
    password: string
    createdAt: string,
}

export default IUserLogin;