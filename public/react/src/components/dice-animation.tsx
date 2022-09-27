import { useEffect, useState } from 'react';
import '../assets/dice/dice.css'
import { AudioMixer } from "./audio"
type DiceType = {
  diceNumber:Number | undefined,

}
export function DiceRoll({diceNumber}:DiceType){

    // let [dataRoll,setDiceRoll] = useState(1)
function rollDice() {
    const dice = [...document.querySelectorAll(".die-list")];
    dice.forEach(die => {
      toggleClasses(die);
      // setDiceRoll(diceNumber) ;
    });
  }
  
  function toggleClasses(die:any) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }
  useEffect(() => {

     rollDice()
  },[diceNumber])
  useEffect(() => {
    const diceSound = new AudioMixer(['dicesound'])
    diceSound.play('dicesound','./src/assets/sounds/diceroll.mp3')
  },[])

    return(
        <div className="  ">
            <div className="dice " >
            <ol className="die-list even-roll " data-roll={diceNumber} id="die-1">
                <li className="die-item " data-side="1">
                <span className="dot "></span>
                </li>
                <li className="die-item " data-side="2">
                <span className="dot"></span>
                <span className="dot"></span>
                </li>
                <li className="die-item " data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                </li>
                <li className="die-item " data-side="4">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                </li>
                <li className="die-item " data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                </li>
                <li className="die-item " data-side="6">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                </li>
            </ol>
    </div>

        </div>
    )
}