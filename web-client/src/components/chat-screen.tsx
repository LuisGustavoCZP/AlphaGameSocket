import { ChatMessages } from "./chat-messages";
function sendMessage(){

}
const mockMessages =[{messageOwner:'server',messageContent:'Testando testando testando', send_at:'22:45'}]
export function ChatScreen (props : any) 
{
    return (
    <section className="flex flex-col h-screen min-w-[200px] w-full max-w-[400px] justify-between">
        <ChatMessages messages='messages'/>
        <div className="flex items-center h-[7vh]">
            <textarea className="w-full h-full resize-none  text-black" name="chat-textarea" id="chat-textarea" placeholder='Digite sua mensagem aqui'></textarea>
            <button onClick={()=>{sendMessage()}} className=" h-full bg-gray border-solid border-black border-2 ">Enviar</button>
        </div>
    </section>
    );
}