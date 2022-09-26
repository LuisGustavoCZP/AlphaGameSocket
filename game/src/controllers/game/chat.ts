import { SocketEvent } from "../../connections";
import { Player } from "./player";

export class Chat
{
	private group: Map<string, Player> | Player[];

	constructor(group:Map<string, Player> | Player[])
	{
		this.group = group;
	}

	public init(player : Player)
	{
		player.onclose(() => {this.removePlayer(player)});

		player.on('chat-message-svr', (content)=>
		{
			console.log('Iniciou chat!', content)
			if(!content.player || !content.payload)
			{
				return;
			}
			console.log(content);

			const {username, payload, time} = this.sanitizeMsg(content);
		
			this.send('chat-message-frt', {username, payload, time});
		});
		
		player.send('start-chat', '%%ESTOU OUVINDO%%');
	}

	public removePlayer(player : Player) 
	{
		player.off('chat-message-svr');
	}

	private sanitizeMsg(content:any)
	{
		const {username} = content.player;
		const payload = content.payload;

		const date = new Date();
		const time = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');

		return {username, payload, time};
	}

	public send (type : string, data : any)
	{
		this.group.forEach(player => 
		{
			player.send(type, data);
		});
	}

	public on (type : string, callback : SocketEvent)
	{
		this.group.forEach(player => 
		{
			player.on(type, callback);
		});
	}
	
	public off (type : string)
	{
		this.group.forEach(player => 
		{
			player.off(type);
		});
	}

	public onclose (callback : SocketEvent)
	{
		this.group.forEach(player => 
		{
			player.onclose(() => callback(player));
		});
	}

}