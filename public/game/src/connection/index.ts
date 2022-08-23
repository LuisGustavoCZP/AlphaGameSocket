class Connection 
{
    instance;
    constructor (url : string)
    {
        console.log();
        this.instance = new WebSocket(`wss://${url}`, ["https", "http"]);
    }
    
}