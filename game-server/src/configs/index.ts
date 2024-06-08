import {CorsOptions} from 'cors';
import {database} from "./database";
import {
    NODE_ENV,
    PORT,
    REDIS_AUTH,
    LOGIN_HOST,
    JWT_SECRET,
    BODY_LIMIT,
} from "./envs";

const port = parseInt("5000");

const redis = REDIS_AUTH;

const gameSpeed = 1;

const serverUrl = LOGIN_HOST;
console.log(serverUrl);

const cripto = {
    saltRounds:10,
    secret:JWT_SECRET,
};

const sessionConfig = {
    get expiration () : number { return sessionConfig.expirationTime * sessionConfig.minute },
    expirationTime: .5,
    minute: 60*1000
};

const validatorConfig = {
    password:{min:6, max:16},
    username:{min:4, max:8}
};


const corsOptions : CorsOptions = {
    origin: NODE_ENV === "development" ? ["https://localhost", "http://localhost"] : ["https://localhost"], //["http://localhost:8000", "http://localhost:5173", "http://127.0.0.1:8000", "http://127.0.0.1:5173", "http://192.168.0.113:8000", "https://207.246.123.33", "https://localhost"],
    credentials:true,
}

const bodyLimit = BODY_LIMIT;

export { port, database, redis, corsOptions, cripto, sessionConfig, validatorConfig, gameSpeed, bodyLimit };