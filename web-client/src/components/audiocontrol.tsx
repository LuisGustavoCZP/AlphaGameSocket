import { AudioMixer } from "./audio";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';

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
    <Box
        /* className="absolute top-1 right-6 bg-white flex items-center h-6 p-1 gap-1" */
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "5px",
            right: "5px",
            background: "white",
            gap: "1rem",
            padding: ".2rem",
            opacity: ".1",
            borderRadius: "15px",
            overflow: "hidden",
            transition: "opacity 500ms",

            ["&:hover"]: {
                opacity: "1",
                
            }
        }}
    >
        <IconButton color="primary" onClick={()=>{changeVol(0)}}>
            <VolumeOffIcon/>
        </IconButton>
        <IconButton color="primary" onClick={()=>{changeVol(Math.max(volume-0.1, 0))}}>
            <VolumeDownIcon/>
        </IconButton>
        <input onChange={e => changeVol(parseFloat(e.target.value))} type="range" min={0} max={1} step={0.1} value={volume}/>
        <IconButton color="primary" onClick={()=>{changeVol(Math.min(volume+0.1, 1))}}>
            <VolumeUpIcon/>
        </IconButton>
    </Box>
    );
}