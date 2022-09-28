import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../contexts";


export function Chat(){
    const [messages, setMessage] = useState<any>([]);
    const [msg, setMsg] = useState('');
    const { connection, getUserData } = useContext(PlayerContext);

    useEffect(()=>
    {
        if(!connection) return;

        const chatConnection = connection;
        chatConnection.on('start-chat', (res)=>
        {
            console.log('Iniciou chat!')
            chatConnection.on('chat-message-frt', (content)=>
            {
                //console.log(content);
                const {username, time, payload} = content;
                const mine = getUserData.username == username;
                messages.push(<Message name={username} time={time} content={payload} mine={mine}/>);
                setMessage(messages.map((e: any)=>e));
                //console.log('consteudo', content);
            });
            
            chatConnection.send('chat-message-svr', 'TESTE DE CONVERSA');
        })
    }, [])

    const sendMessage = ()=>{
        if(!msg) return;
        connection.send('chat-message-svr', {player:getUserData, payload:msg });
        setMsg('');
    }
    
    const keyPressHandler = (e:any)=>{
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            sendMessage();
        }
    }

    useEffect(() => 
    {
        const msgContainer = document.getElementById("msgs");

    }, [messages])
//max-h-[75%]
    return (
        <div className="min-w-1/4 portrait:w-full bg-[#7A7A7A] h-full flex items-center justify-start flex-col portrait:h-1/4">
            <h2 className="p-3 text-2xl">Chat</h2>
            <div className="flex flex-col w-full h-full portrait:flex-row items-center overflow-hidden">
                <div id="msgs" className="flex w-full bg-transparent h-4/5 max-h-full overflow-y-scroll">
                    <ul className="flex flex-col flex-grow h-fit">
                        {messages}
                    </ul>
                </div>
                <div className="flex flex-col h-fit w-11/12 bg-[#3E3E3E] p-2 mx-4 my-2 text-white portrait:flex-col-reverse">
                    <textarea onKeyDown={keyPressHandler} onChange={(e)=>setMsg(e.target.value||'')} className="resize-none outline-none h-2/3 w-full bg-[#3E3E3E] placeholder:text-white" name="chat-textarea" id="chat-textarea" cols={30} rows={4} placeholder="Escreva sua mensagem..." value={msg}></textarea>
                    <button onClick={sendMessage} className="w-full text-base p-1">Enviar</button>
                </div>
            </div>
        </div>
    )
}

function Message(props:{content:string, time:string, name:string, mine?:boolean}){
    return (//+props.mine?" justify-end":""
        <li>
            <div className={"flex flex-col bg-[#EFEFEF] w-full text-[#333333] mx-auto my-0 p-2 mb-[5px]"+(props.mine?" bg-[#cccccc] justify-end":"")}>
                <h2 className={"mb-1 text-xs w-full flex items-center justify-between"+(props.mine?" flex-row-reverse":"")}>{props.name} <span>{props.time}</span></h2>
                <p className={(props.mine?"text-end":"")}>{props.content}</p>
            </div>
        </li>
    )
}