import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions, bodyLimit } from './configs';
import router from './routes';
import { Server } from './server';
import { connectionManager, /* gameManager */ } from './connections';


const server = new Server(({server, app}) =>
{
    app.use(express.urlencoded({ limit: bodyLimit, extended: true }));
    app.use(express.json({limit: bodyLimit}));

    app.use(cookieParser());

    app.use(cors(corsOptions));

    app.get("/", (req, res) => {
        console.log("Requisição veio para", req.url);
        res.status(200).send("Online");
    })
    app.use("/api", router);
});
/* gameManager.start(); */
connectionManager.start(server);

server.listen((host) => 
{
    console.log("Login Server Ready at:\n\t", host);
    //const pc = exec(`cd ${rootPath} && npm run dev:gameserver`, {});
});