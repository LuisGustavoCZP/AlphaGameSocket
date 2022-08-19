import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './configs';
import { staticRouter } from './routes';
import { Server } from './server';

const app = express();

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(cors(corsOptions));

app.use(staticRouter);

const server = new Server(app);

server.listen();