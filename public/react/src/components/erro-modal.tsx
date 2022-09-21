import { useEffect, useState, ReactNode } from "react";

type modalErrorType = {
    message:string,
    state:string,
    slideState:string,
    closeModal:() => void
}

export function ModalError({message,state, slideState, closeModal}:modalErrorType){
    
    return( <div onClick={()=>{closeModal()}} className={"bg-[#00000099] flex-col-reverse w-screen h-screen fixed m-0 "+state}>
        <div className={"h-2/6 w-2/6 bg-[rgb(46,46,46)] relative flex flex-col transform transition-all self-end justify-self-end place-self-end my-4 mx-4 "+slideState}>
            <div id="test" className="flex justify-between px-3 items-center w-full bg-[#dadada] text-[#0f0f0f]">
                <p>Aviso!</p>
                <button>X</button>
            </div>
            <p className="p-4">{`${message}`}</p>
        </div>
    </div>)
}