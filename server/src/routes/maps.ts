import express, {Router} from 'express';
import fs from "fs";
import { gamePath } from '../paths';

const mapList : string[] = [];

function loadMaps ()
{
    const maps = fs.readdirSync(`${gamePath}/maps/tilemaps`);
    maps.forEach(element => {
        mapList.push(element);
    });
    console.log(maps);
}
loadMaps ();

const router = Router();

router.use('/assets/map', (req, res)=>
{
    const p = `${gamePath}/maps/tilemaps/${mapList[2]}`;
    console.log("procurando mapa!", p)
    res.sendFile(p);
});

export default router;