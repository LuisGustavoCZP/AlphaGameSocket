import express, {Router} from 'express';
import fs from "fs";
import { gamePath } from '../paths';

const mapList = [];

function loadMaps ()
{
    const maps = fs.readdirSync(`${gamePath}/maps/tilemaps`);
    console.log(maps);
}
loadMaps ();

const router = Router();

router.use('/maps', (req, res)=>
{
    
});

export default router;