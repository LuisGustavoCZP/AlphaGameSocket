import fs from "fs";
import {ServerOptions} from "https";

const options : ServerOptions = {
    key: fs.readFileSync('./security/key-rsa.pem'),
    cert: fs.readFileSync('./security/cert.pem')
};

export default options;