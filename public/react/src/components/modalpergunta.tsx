import { useContext, useEffect, useMemo, useState } from "react"

export function ModalPergunta(){
    
    
    
    return<div className="flex bg-[#00000099] items-center justify-center w-screen h-screen fixed">
        <div className="h-3/4 w-4/5 bg-[#D9D9D9] relative flex flex-col content-start items-center">
            <div className="w-full text-[58px] bg-[#3E3E3E] pl-10 leading-[80px]">
                <h2 >Pergunta</h2>
            </div>
            <div className="flex justify-between pl-6 pr-6 w-full text-black text-[36px] leading-[80px]">
                <p>Insira a pergunta aqui </p>
                <div>Relogio vai aqui</div>
            </div>
            <ul className="text-black leading-[50px] self-start pl-10">
                <li><input type="radio" name="resposta" id="resposta1" /> <label htmlFor="resposta1">Insira a resposta 1 aqui</label></li>
                <li><input type="radio" name="resposta" id="resposta2" /> <label htmlFor="resposta2">Insira a resposta 2 aqui</label></li>
                <li><input type="radio" name="resposta" id="resposta3" /> <label htmlFor="resposta3">Insira a resposta 3 aqui</label></li>
                <li><input type="radio" name="resposta" id="resposta4" /> <label htmlFor="resposta4">Insira a resposta 4 aqui</label></li>
            </ul>
            <button className="bg-[#7A7A7A]  border-2 border-black leading-[50px] text-[40px] absolute bottom-5" type="button">Enviar</button>
            <div className="w-1/5 h-1/4 bottom-[10px] right-[20px] absolute ">
                <div className="w-full bg-[#343434] text-[22px] ">Itens</div>
                <ul className=" text-black bg-[#7A7A7A]">
                    <li>Bomba</li>
                    <li>Chance extra</li>
                    <li>Nova Pergunta</li>
                    <li>Mais Tempo</li>
                    
                </ul>

            </div>
        </div>
    </div>
}