async function waitTime (ms : number)
{
    return await new Promise((resolve, reject) => {setTimeout(resolve, ms);})
}

async function waitUntil (condition : () => boolean)
{
    return await new Promise<void>((resolve, reject) => 
    {
        function checkCondition ()
        {
            if(!condition()) setTimeout(checkCondition, 500);
            else resolve();
        }

        checkCondition ();
    });
}

export {waitTime, waitUntil}