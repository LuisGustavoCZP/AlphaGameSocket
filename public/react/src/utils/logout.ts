export async function logOut(server:string){
    await fetch(`https://${server}/users/logout`, {
            method: "GET",
            headers: 
            {
                'Content-Type': 'application/json',
            }
        })
}