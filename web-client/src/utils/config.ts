class Configs
{
    server = `${location.hostname}/api`;
    gameserver = `${location.hostname}/game`;

    constructor()
    {
        /* if(location.port == "5173")
        {
            this.server = "localhost:8080";
            this.gameserver = "localhost:5000";
        } */
    }
}

const configs = new Configs();
export default configs;