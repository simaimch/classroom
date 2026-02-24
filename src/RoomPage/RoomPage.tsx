import { Link, useParams } from "react-router-dom";
import MenuBar from "../_ui/MenuBar";
import { useContext } from "react";
import { AccountContext } from "../_contexts/AccountContext";
import Grid from "./Grid";
import { SetAccount } from "../App";

export default function RoomPage(){

    let {roomId} = useParams();
    let account = useContext(AccountContext);

    //const navigate = useNavigate();

    const roomToDisplay = account?.rooms[roomId ?? ""];

    function updateLabel(newLabel: string){
        if(!account || !roomId) return;
        const newAccount = {
            ...account,
        }
        newAccount.rooms[roomId].label = newLabel;
        SetAccount(newAccount);
    }

    return(
        <div className="page">
            <MenuBar>
                <Link to={"/"}>Startseite</Link>
            </MenuBar>
            <h1><input value={roomToDisplay?.label} onChange={(e)=>updateLabel(e.target.value)}/></h1>
            <Grid roomId={roomId ?? ""} margin={7}/>
        </div>
    );
}