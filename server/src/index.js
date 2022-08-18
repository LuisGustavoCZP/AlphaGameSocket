const express = require("express");

const port = 8000;
const app = express();

const path = __dirname;
const serverPath = path.slice(0, path.lastIndexOf('\\'));
const rootPath = serverPath.slice(0, serverPath.lastIndexOf('\\'));
const gamePath = `${rootPath}/public/game`;


app.use('/scripts', express.static(`${gamePath}/dist`));
app.use('/data', express.static(`${gamePath}/data`));
app.use('/assets', express.static(`${gamePath}/assets`));
app.use('/', express.static(`${gamePath}/web`));

app.listen(port, () => { console.log(`http://localhost:${port}`); });