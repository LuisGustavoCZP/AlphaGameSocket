const fs = require("fs");

function createMap ()
{
    const tiles = [];

    for(let i = 0; i < 11; i++)
    {
        const k = i*1;
        
        const tile = {
            index:tiles.length,
            id:k, 
            d:1,
            next:[],
            back:[]
        };

        if(i == 0)
        {
            tile.d+=2;
        }
        else if(i == 10)
        {
            tile.d+=4;
        }

        tile.next.push(tiles.length+1);
        tiles.push(tile);
    }

    for(let i = 1; i < 11; i++)
    {
        const k = 10 + (i*11);

        const tile = {
            index:tiles.length,
            id:k, 
            d:4,
            next:[],
            back:[]
        };

        if(i == 10)
        {
            tile.d+=8;
        }

        tile.next.push(tiles.length+1);
        tiles.push(tile);
    }

    for(let i = 1; i < 11; i++)
    {
        const k = 120 - i;

        const tile = {
            index:tiles.length,
            id:k, 
            d:8,
            next:[],
            back:[]
        };

        if(i == 10)
        {
            tile.d+=2;
        }

        tile.next.push(tiles.length+1);
        tiles.push(tile);
    }

    for(let i = 1; i < 10; i++)
    {
        const k = 110 - (i*11);

        const tile = {
            index:tiles.length,
            id:k, 
            d:2,
            next:[],
            back:[]
        };

        if(i == 9) tile.next.push(0);
        else tile.next.push(tiles.length+1);
        tiles.push(tile);
    }

    fs.writeFileSync(__dirname+"/test1.json", JSON.stringify(tiles, null, 2));
}

createMap ();