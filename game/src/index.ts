import express from 'express';
import cors from 'cors';
import { corsOptions } from './configs';
import { Server } from './server';
import { Connections } from './connections';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(cors(corsOptions));

const server = new Server(app);
const websocket = new Connections(server);

server.listen();