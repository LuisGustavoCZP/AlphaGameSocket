import { useState } from 'react';
import '../assets/dice/dice.css'

export function DiceRoll(){

    let [dataRoll,setDiceRoll] = useState(1)
function rollDice() {
    const dice = [...document.querySelectorAll(".die-list")];
    dice.forEach(die => {
      toggleClasses(die);
      setDiceRoll(getRandomNumber(1, 6)) ;
    });
  }
  
  function toggleClasses(die:any) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }
  
  function getRandomNumber(min:any, max:any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


    return(
        <div className="  ">
            <div className="dice " onClick={rollDice} >
            <ol className="die-list even-roll " data-roll={dataRoll} id="die-1">
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