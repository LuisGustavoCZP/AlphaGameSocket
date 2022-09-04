import { useContext, useEffect, useState } from "react";
import GlobalContext from "../contexts/global-context";

export function GameRoom (props : any)
{
    const {getID} = useContext(GlobalContext);
    return (
        <iframe src={`/game#${getID}`} width={528} height={528}></iframe>
    );
}