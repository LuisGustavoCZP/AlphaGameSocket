const path = __dirname;
const isCounterBar = path.includes('\\');
const serverPath = path.slice(0, isCounterBar ? path.lastIndexOf('\\') : path.lastIndexOf('/'));
const rootPath = serverPath.slice(0, isCounterBar ? serverPath.lastIndexOf('\\') : serverPath.lastIndexOf('/'));
const gamePath = `${rootPath}/public/game`;

export { serverPath, rootPath, gamePath }