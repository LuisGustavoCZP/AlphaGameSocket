import certs from "./certs";
import * as dotenv from "dotenv";
import {CorsOptions} from 'cors';

dotenv.config();

const port = parseInt(process.env.PORT || "8000");
const isSsl = process.env.SSL ? process.env.SSL == "true" : false;

const postgres = process.env.POSTGRES;

const cripto = {
    saltRounds:10,
    secret:"jacareperneta"
};

const sessionConfig = {
    get expiration () : number { return sessionConfig.expirationTime * sessionConfig.minute },
    expirationTime: .5,
    minute: 60*1000
};

const validatorConfig = {
    password:{min:6, max:6},
    username:{min:4, max:8}
};

const corsOptions : CorsOptions = {
    origin:["http://localhost:8000", "http://localhost:5173", "http://127.0.0.1:8000", "http://127.0.0.1:5173", "http://192.168.0.113:8000"],
    credentials:true,
}

export { certs, port, isSsl, postgres, corsOptions, cripto, sessionConfig, validatorConfig };