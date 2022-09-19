import { readFileSync } from "fs";

export function loadSync <T> (path : string) : T
{
    const file = readFileSync(path);
    return JSON.parse(file.toString());
}