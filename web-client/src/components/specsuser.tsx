import { Fragment, useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";

import { IPlayerData } from "../game/player";
import { PlayerData } from "../models";
import { logOut } from "../utils/logout";
import configs from "../utils/config";
import { TutorialModal } from "./tutorial-modal";

export interface IPlayerStateProps 
{
    player:PlayerData;
    inGame?: boolean;
    className? : string;
}

export function SpecsUser({player, inGame, className}:IPlayerStateProps )
{
    const [tutorial,handleTutorial] = useState(<></>)
    function closeModal(){
        handleTutorial(<></>)
    }
    function openTutorial(){
        handleTutorial(<TutorialModal closeModal={closeModal} />)
    }
    return(
        <div className={"flex items-center px-3 py-1 w-full justify-between"+(className?` ${className}`:'')}>
            <Avatar></Avatar>
            <Box>
                <Typography component="h3" fontSize={"1.2rem"}>{player.username}</Typography>
                <Typography fontSize={".6rem"}>{player.score} P</Typography>
            </Box>
            {!inGame? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                    }}
                >
                    <Button variant="contained" sx={{fontSize: ".6rem", width: "100%"}} onClick={()=>{openTutorial()}}>Tutorial</Button>
                    <Button variant="outlined" sx={{fontSize: ".6rem", width: "100%"}} onClick={()=>{logOut(configs.server)}}>LogOut</Button>
                </Box>
            ) :null}
            {tutorial}
        </div>
    )
}

