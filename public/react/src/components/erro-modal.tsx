import { useEffect, useState, ReactNode } from "react";

type modalErrorType = {
    message:string,
    state:string,
    closeModal:() => void
}

export function ModalError({message,state,closeModal}:modalErrorType){
    
    return( <div onClick={()=>{closeModal()}} className={"bg-[#00000099] flex-col-reverse w-screen h-screen fixed m-0 "+state}>
        <div className="h-[20%] w-1/6 bg-[rgb(46,46,46)] relative flex flex-col content-center items-center transform transition-all self-end justify-self-end place-self-end m-4">
            <div className="flex justify-between px-3 items-center w-full bg-[#dadada] text-[#0f0f0f]">
                <p>Aviso!</p>
                <button>X</button>
            </div>
            <p className="self-center place-self-center py-6">{`${message}`}</p>
        </div>
    </div>)
}