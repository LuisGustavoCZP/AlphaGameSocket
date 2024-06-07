async function waitTime (ms : number)
{
    return await new Promise((resolve, reject) => {setTimeout(resolve, ms);})
}

async function waitUntil (condition : () => boolean, interval = 100)
{
    return await new Promise<void>((resolve, reject) => 
    {
        function checkCondition ()
        {
            if(!condition()) setTimeout(checkCondition, interval);
            else resolve();
        }

        checkCondition ();
    });
}

async function waitBut (condition : () => boolean, max : number, interval = 100) 
{
    return await Promise.race([waitUntil(condition, interval), waitTime(max)]);
}

export {waitTime, waitUntil, waitBut};