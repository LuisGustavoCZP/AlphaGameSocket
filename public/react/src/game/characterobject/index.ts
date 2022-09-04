import { gameManager } from "../gamedata";
import { AnimatedObject, ICharacterData } from "../gameobject";

export class CharacterObject extends AnimatedObject
{
    tileIndex : number;
    move : number;
    tileOffsetX : number;
    tileOffsetY : number;

    constructor (id : string, characterData : ICharacterData, index : number, tileIndex : number)
    {
        super(id, characterData, 0, 0, 0);
        this.tileIndex = tileIndex;
        this.move = 0;
        const i = (index%2), j = ((index) - i)/2;
        const map = gameManager.map;
        const tile = map.tiles[tileIndex];
        const size = this.size;

        this.tileOffsetX = (size/2) + (i*size);
        this.tileOffsetY = (size/4) + (j*size);

        this.x = tile.x + this.tileOffsetX;
        this.y = tile.y + this.tileOffsetY;
    }
}