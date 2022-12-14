import express from 'express';
import cors from 'cors';
import { corsOptions } from './configs';
import { Server } from './server';
import { connections } from './connections';
import { gameManager } from './controllers/game';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(cors(corsOptions));

const server = new Server(app);
connections.start(server);

server.listen();