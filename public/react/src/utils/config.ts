class Configs
{
    server = location.host;
    gameserver = location.host.replace("8000", "5000");

    constructor()
    {
        if(location.port == "5173")
        {
            this.server = "localhost:8000";
            this.gameserver = "localhost:5000";
        }
    }
}

const configs = new Configs();
export default configs;