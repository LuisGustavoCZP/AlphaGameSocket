export async function logOut(server:string){
    let resposta = await(await fetch(`https://${server}/users/logout`, {
            method: "GET",
            headers: 
            {
                'Content-Type': 'application/json',
            },credentials: 'include'
        })).json()
        console.log((resposta))
        location.reload()
}