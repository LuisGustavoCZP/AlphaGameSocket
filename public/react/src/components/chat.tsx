import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../contexts";


export function Chat(){
    const [messages, setMessage] = useState<any>([]);
    const [msg, setMsg] = useState('');
    const { connection, getUserData } = useContext(PlayerContext);

    useEffect(()=>{
        if(!connection) return;

        const chatConnection = connection;
        chatConnection.on('start-chat', (res)=>{

            chatConnection.on('chat-message-frt', (content)=>{
                const {username, time, payload} = content
                messages.push(<Message name={username} time={time} content={payload}/>);
                setMessage(messages.map((e: any)=>e));
                console.log('consteudo', content);
            })
            
            chatConnection.send('chat-message-svr', 'TESTE DE CONVERSA');
        })
    }, [])

    const sendMessage = ()=>{
        if(!msg){
            console.log('block');
            return
        }
        connection.send('chat-message-svr', {player:getUserData, payload:msg });
        setMsg('');
    }
    
    const keyPressHandler = (e:any)=>{
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="w-1/5 bg-[#7A7A7A] h-full flex items-center justify-start flex-col">
            <div className="w-full bg-transparent h-4/5 max-h-[75%]">
                <h2 className="p-3 text-2xl">Chat</h2>
                <ul className="overflow-y-scroll h-5/6">
                    {messages}
                </ul>
            </div>
            <div className="h-1/5 w-11/12 bg-[#3E3E3E] p-2 m-4 text-white">
                <textarea onKeyDown={keyPressHandler} onChange={(e)=>setMsg(e.target.value||'')} className="resize-none outline-none h-2/3 w-full bg-[#3E3E3E] placeholder:text-white" name="chat-textarea" id="chat-textarea" cols={30} rows={4} placeholder="Escreva sua mensagem..." value={msg}></textarea>
                <button onClick={sendMessage} className="w-full text-base p-1">Enviar</button>
            </div>
        </div>
    )
}

function Message(props:{content:string, time:string, name:string}){
    return (
        <li>
            <div className="bg-[#EFEFEF] w-full text-[#333333] mx-auto my-0 p-2 mb-[5px]">
                <h2 className="mb-1 text-xs w-full flex items-center justify-between">{props.name} <span>{props.time}</span></h2>
                <p>{props.content}</p>
            </div>
        </li>
    )
}