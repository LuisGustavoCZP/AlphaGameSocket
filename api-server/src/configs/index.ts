import {CorsOptions} from 'cors';
import {database} from "./database";
import {
    REDIS_AUTH,
    GAME_HOST,
    JWT_SECRET,
    BODY_LIMIT,
} from "./envs";

const port = 8080;

const redis = REDIS_AUTH;
const serverUrl = GAME_HOST;
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
    origin: ["http://localhost:8000", "http://localhost:5173", "https://localhost"],
    credentials:true,
}

const bodyLimit = BODY_LIMIT;

export { port, database, redis, corsOptions, cripto, sessionConfig, validatorConfig, bodyLimit };