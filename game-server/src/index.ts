import express from 'express';
import cors from 'cors';
import { corsOptions, bodyLimit } from './configs';
import { Server } from './server';
import { connections } from './connections';
import { gameManager } from './controllers/game';

const app = express();

app.use(express.urlencoded({ limit: bodyLimit, extended: true }));
app.use(express.json({limit: bodyLimit}));

app.use(cors(corsOptions));
//app.use(cookieParser());

const server = new Server(app);
connections.start(server);

server.listen((host) =>
{
    console.log("Game Server Ready at:\n\t", host);
    //const pc = exec(`cd ${rootPath} && npm run dev:gameserver`, {});
});