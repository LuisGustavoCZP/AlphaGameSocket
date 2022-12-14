import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './configs';
import router from './routes';
import { Server } from './server';
import { connectionManager, /* gameManager */ } from './connections';
import { exec } from 'node:child_process';
import { rootPath } from './utils/paths';
import redis from './clients/redis';

const app = express();

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(cors(corsOptions));

app.use(router);

const server = new Server(app);
/* gameManager.start(); */
connectionManager.start(server);


server.listen(() => 
{
    //const pc = exec(`cd ${rootPath} && npm run dev:gameserver`, {});
});