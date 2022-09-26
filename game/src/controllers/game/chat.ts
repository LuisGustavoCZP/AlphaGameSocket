import { Player } from "./player";

export class Chat{
  private group: Map<string, Player>|Player[];
  private player: Player;

  constructor(player:Player, group:Map<string, Player>|Player[]){
    this.group = group;
    this.player = player
  }

  public init(){
    this.player.on('chat-message-svr', (content)=>{
      if(!content.player || !content.payload){
        return;
      }

      console.log(content);
  
      const {username, payload, time} = this.sanitizeMsg(content);
  
      if(this.group instanceof Map){
        this.group = this.createArrPlayer(this.group);
      }
  
      this.group.forEach(e=>{
        if(!e)return;
        e.send('chat-message-frt', {username, payload, time});
      })
    });
    
    this.player.send('start-chat', '%%ESTOU OUVINDO%%');
  }

  static removePlayer(player:Player) {
    player.off('chat-message-svr');
  }

  private createArrPlayer(group:Map<string, Player>){
    let arr:Player[] = [];

    try{
      arr = Array.from(group.values());
      return arr;
    }catch (error){
      console.log('aconteceu um erro -->', error, group);
      return arr;
    }
  }

  private sanitizeMsg(content:any){
    const {username} = content.player;
    const payload = content.payload;

    const date = new Date();
    const time = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');

    return {username, payload, time};
  }

}