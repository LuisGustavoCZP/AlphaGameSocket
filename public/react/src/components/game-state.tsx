import { InventoryState } from "./inventory-state";
import { PlayersState } from "./players-state";

export function GameState (props : any)
{
    return (
    <section className="flex flex-col h-full w-full min-w-[200px] max-w-[400px]">
        <PlayersState/>
        <InventoryState/>
    </section>
    );
}