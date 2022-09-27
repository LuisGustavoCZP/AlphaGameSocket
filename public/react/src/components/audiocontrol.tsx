import { AudioMixer } from "./audio"
import imgSoundUp from '../assets/sprites/soundup.png'
import imgSoundDown from '../assets/sprites/sounddown.png'
import imgMuteSound from '../assets/sprites/mutesound.png'

export const masterAudio = new AudioMixer(['mainroomsoundtrack','matchroomsoundtrack','gamesoundtrack','dicesound','yourturn'])

export function AudioControl(){
    function changeVol(e:any){
        masterAudio.volume(e.target.value)
    }
    return <div className="absolute bottom-1 right-6 bg-white flex items-center h-6 gap-1"><button className="p-0 h-full" onClick={()=>{masterAudio.volume(0)}}><img className="h-full" src={imgMuteSound} alt="" /></button><img className="h-full" src={imgSoundDown} alt="" /><input onChange={changeVol} type="range" min={0} max={1} step={0.1} /><img className="h-full" src={imgSoundUp} alt="" /></div>
}