import { InventoryState } from "./inventory-state";
import { PlayersState } from "./players-state";
import { SpecsUser } from "./specsuser";
import {ModalPergunta} from './modalpergunta'
export function GameState (props : any)
{
    return (
    <section className="flex flex-col h-full w-full min-w-[200px] max-w-[400px] gap-4">
        <SpecsUser />
        <PlayersState/>
        <InventoryState/>
        <ModalPergunta/>
    </section>
    );
}