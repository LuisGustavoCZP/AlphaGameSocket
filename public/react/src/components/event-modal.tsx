import { useEffect, useState, ReactNode } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { waitTime, waitUntil } from "../utils/wait";

export type IEventChoose = (option? : number) => void;

export interface IEventProps 
{
    finalTime : number,
    choose : IEventChoose,
}

export interface IEventModalProps 
{
    title: string,
    finalTime? : number,
    choose? : IEventChoose,
    children : ReactNode
}

export function EventModal ({title, finalTime, choose, children} : IEventModalProps)
{
    const [totalTime, setTotalTime] = useState(0);
    const [timeLeft, timeHandler] = useState(totalTime);

    function tick()
    {
        if(!finalTime) return;
        const timeLeft = Math.max(0, finalTime - Date.now());
        timeHandler(timeLeft);
        if(timeLeft <= 0) 
        {
            if(choose) choose();
        }
    }

    useEffect(()=>
    {
        if(!finalTime) return;

        setTotalTime(finalTime - Date.now());
        const interval = setInterval(()=> tick(), 500);
        return ()=>clearInterval(interval)
    },[]);

    return (
        <div className="flex bg-[#00000099] items-center justify-center w-screen h-screen fixed m-0 ">
            <div className="h-3/4 w-4/5 bg-[#D9D9D9] relative flex flex-col content-center items-center transform transition-all ">
                <div className="w-full text-[58px] bg-[#3E3E3E] pl-10 leading-[80px] flex justify-between">
                    <h2>{title}</h2>
                    <div className='w-20 h-20'>
                        {finalTime?<CircularProgressbar value={(timeLeft/totalTime)*100} text={`${Math.floor(timeLeft/1000)}s`}  styles={buildStyles({
                            // Rotation of path and trail, in number of turns (0-1)
                            rotation: 1,

                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'round',

                            // Text size
                            textSize: '16px',

                            // How long animation takes to go from one percentage to another, in seconds
                            pathTransitionDuration: 0.5,

                            // Can specify path transition in more detail, or remove it entirely
                            // pathTransition: 'none',

                            // Colors
                            pathColor: `#e2e2e2`,
                            textColor: '#e2e2e2',
                            trailColor: '#757575',
                            backgroundColor: '#3e98c7',
                        })}/>:<></>}
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}