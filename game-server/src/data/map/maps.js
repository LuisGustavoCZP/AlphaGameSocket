const fs = require("fs");
const { clientPath } = require("../../utils/path");

function parseTiles (parsedMap, parsedTileset)
{
    const {height, width} = parsedMap;
    const tiles = {height, width, length:0, tiles:{}};
    parsedMap.layers.forEach(layer => 
    {
        const t = layer.width*layer.height;
        for(let k = 0; k < t; k++)
        {
            const tileid = layer.data[k]-1;
            if(tileid >= 0)
            {
                const { properties } = parsedTileset.tiles[tileid];
                const props = Object.fromEntries(properties.map(prop => [prop.name, prop.value]));

                if(!props.path) continue;
                if(!tiles.tiles[k]) 
                {
                    tiles.tiles[k] = { id:k, ...props };
                    tiles.length ++;
                }
                else tiles.tiles[k] = Object.assign(tiles.tiles[k], ...props);
            }
        }
    });
    return tiles;
}

function layerHas (layer, value)
{
    return (layer & value) > 0;
}

/**
 * @param {Set<number>} tileset 
 * @param {{height : number, width : number, length : number} parsedTiles 
 * @param {{path:boolean, order:number, type:number, next:number[], back:number[]}} tiles 
 * @param {number} tileIndex 
 */
function mapTiles (tileset, parsedTiles, tiles, tileIndex)
{
    if(tileset.has(tileIndex)) return;
    tileset.add(tileIndex);

    const x = tileIndex % parsedTiles.width;
    const y = (tileIndex - x) / parsedTiles.width;

    const pT = parsedTiles.tiles[tileIndex];
    if(!pT) return;
    
    const tile = {
        ...pT,
        next:[],
        back:[]
    };

    const centerVertical = pT.order == 32;
    const centerHorizontal = pT.order == 16;
    const center = pT.order == 48;
    const HOrder = pT.order == 3 || pT.order == 1 || pT.order == 9 || pT.order == 2 || pT.order == 33 || pT.order == 24 || centerHorizontal || center;
    const VOrder = (pT.order == 12 || pT.order == 8 || pT.order == 9 || pT.order == 1 || pT.order == 24) && !centerVertical && !center;

    if(!centerVertical)
    {
        const forward = HOrder? 1 : -1;
        const next = x + forward;
        const last = x - forward;
        const max = parsedTiles.width;

        if((next >= 0 && forward < 0) || (forward > 0 && next < max))
        {
            const ti = next + (y * parsedTiles.width);
            const nextTile = parsedTiles.tiles[ti];
            
            if(nextTile) 
            {
                if(pT.order != 24) tile.next.unshift(ti);
                else tile.next.push(ti);
            }
        }

        if((last >= 0 && forward > 0) || (forward < 0 && last < max))
        {
            const ti = last + (y * parsedTiles.width);
            const lastTile = parsedTiles.tiles[ti];
            //if(lastTile) tile.back.push(ti);
            if(lastTile) 
            {
                if(pT.order != 16) tile.back.unshift(ti);
                else tile.back.push(ti);
            }
        }
    }

    if(!centerHorizontal)
    {
        const forward = VOrder? -1 : +1;
        const next = y + forward;
        const last = y - forward;
        const max = parsedTiles.height;

        if((next >= 0 && forward > 0) || (forward < 0 && next < max))
        {
            const ti = x+(next*parsedTiles.width);
            const nextTile = parsedTiles.tiles[ti];
            /* if(nextTile) tile.next.push(ti); */
            if(nextTile) 
            {
                if(pT.order != 33) tile.next.unshift(ti);
                else tile.next.push(ti);
            }
        }

        if((last >= 0 && forward < 0) || (forward > 0 && last < max))
        {
            const ti = x+(last*parsedTiles.width);
            const lastTile = parsedTiles.tiles[ti];
            //if(lastTile) tile.back.push(ti);
            if(lastTile) 
            {
                if(pT.order != 32) tile.back.unshift(ti);
                else tile.back.push(ti);
            }
        }
    }

    tiles[tileIndex] = (tile);

    tile.next.forEach(ti => 
    {
        mapTiles(tileset, parsedTiles, tiles, ti);
    });

    tile.back.forEach(ti => 
    {
        mapTiles(tileset, parsedTiles, tiles, ti);
    });
}

function extractMap (path)
{
    const file = fs.readFileSync(`${clientPath}/src/assets/maps/${path}`);
    if(file)
    {
        const parsedMap = JSON.parse(file);
        const tilesetFileSrc = parsedMap.tilesets[0].source;
        const tilesetFile = fs.readFileSync(`${clientPath}/src/assets/maps/${tilesetFileSrc.replace('../', '')}`);
        const parsedTileset = JSON.parse(tilesetFile);
        
        const parsedTiles = parseTiles(parsedMap, parsedTileset);

        const tiles = {};
        let tileIndex = 110;

        mapTiles(new Set(), parsedTiles, tiles, tileIndex);

        const current = Object.keys(tiles).length;
        const total = parsedTiles.length;

        const erros = [];
        Object.keys(parsedTiles.tiles).forEach(key => 
        {
            if(!tiles[key])
            {
                erros.push(key);
            }
        });

        console.log(`Build ${erros.length? "falhou" : "completa"} ${current}/${total}`, erros);
    
        const tileArray = Object.entries(tiles);
        const tilemap = {
            height: parsedTiles.height,
            width: parsedTiles.width,
            sides:[
                tileArray.filter(([key, tile]) => tile.order == 1 || tile.order == 5).map(([key, tile]) => tile.id),
                tileArray.filter(([key, tile]) => tile.order == 2).map(([key, tile]) => tile.id),
                tileArray.filter(([key, tile]) => tile.order == 4).map(([key, tile]) => tile.id),
                tileArray.filter(([key, tile]) => tile.order == 8 || tile.order == 24).map(([key, tile]) => tile.id),
                tileArray.filter(([key, tile]) => tile.order == 16).map(([key, tile]) => tile.id),
                tileArray.filter(([key, tile]) => tile.order == 32).map(([key, tile]) => tile.id),
                tileArray.filter(([key, tile]) => tile.order == 48).map(([key, tile]) => tile.id),
            ],
            tiles:tileArray
        };

        fs.writeFileSync(__dirname+"/test1.json", JSON.stringify(tilemap, null, 2));
    }
}

extractMap('tilemaps/tabuleiro.tmj');