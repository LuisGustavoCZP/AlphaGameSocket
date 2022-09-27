import charactersData from '../assets/data/characters.json';

import randomCharacter from "../assets/personagens/random.png";
import person1 from "../assets/personagens/person1.png";
import person2 from "../assets/personagens/person2.png";
import person3 from "../assets/personagens/person3.png";
import person4 from "../assets/personagens/person4.png";
import person5 from "../assets/personagens/person5.png";
import person6 from "../assets/personagens/person6.png";

const icons = [
    randomCharacter,
    person1,
    person2,
    person3,
    person4,
    person5,
    person6,
];

export function Character ({charID, size, title} : {charID : number, size? : number, title? : string})
{
    const character = charID >= 0?charactersData[charID] : null;
    const playerImg = character? icons[character.portait] : randomCharacter;
    return (
    <span className='flex items-center' title={title}>
        <img className={size?`w-${size} h-${size}`:''} src={playerImg} />
    </span>
    );
}