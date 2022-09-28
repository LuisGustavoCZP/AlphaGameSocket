import { AudioMixer } from "./audio"
import imgSoundUp from '../assets/sprites/soundup.png'
import imgSoundDown from '../assets/sprites/sounddown.png'
import imgMuteSound from '../assets/sprites/mutesound.png'
import { useEffect, useState } from "react"

export const masterAudio = new AudioMixer(['mainroomsoundtrack','matchroomsoundtrack','gamesoundtrack','dicesound','yourturn'])

export function AudioControl()
{
    const [volume, setVolume] = useState(masterAudio.volume);

    function changeVol(vol : number)
    {
        setVolume(vol);
        masterAudio.volume = vol;
    }

    useEffect(()=>
    {

    })

    return (
    <div className="absolute bottom-1 right-6 bg-white flex items-center h-6 gap-1">
        <button className="p-0 h-full" onClick={()=>{changeVol(0)}}>
        <img className="h-full" src={imgMuteSound} alt="" />
        </button><img className="h-full" src={imgSoundDown} alt="" />
        <input onChange={e => changeVol(parseFloat(e.target.value))} type="range" min={0} max={1} step={0.1} value={volume}/>
        <img className="h-full" src={imgSoundUp} alt="" />
    </div>
    );
}