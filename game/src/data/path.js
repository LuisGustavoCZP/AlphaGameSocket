const path = __dirname;
const isCounterBar = path.includes('\\');
const thisPath = path.slice(0, isCounterBar ? path.lastIndexOf('\\') : path.lastIndexOf('/'));
const serverPath = path.slice(0, isCounterBar ? thisPath.lastIndexOf('\\') : thisPath.lastIndexOf('/'));
const rootPath = serverPath.slice(0, isCounterBar ? serverPath.lastIndexOf('\\') : serverPath.lastIndexOf('/'));
const gamePath = `${rootPath}/public/game`;
const clientPath = `${rootPath}/public/react`;

module.exports = { thisPath, serverPath, rootPath, gamePath, clientPath }