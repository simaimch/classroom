import { Link, useNavigate, useParams } from "react-router-dom";
import MenuBar from "../_ui/MenuBar";
import { useContext } from "react";
import { AccountContext } from "../_contexts/AccountContext";
import Grid from "./Grid";

export default function RoomPage(){

    let {roomId} = useParams();
    let account = useContext(AccountContext);

    const navigate = useNavigate();

    const roomToDisplay = account?.rooms[roomId ?? ""];

    return(
        <div className="page">
            <MenuBar>
                <Link to={"/"}>Startseite</Link>
            </MenuBar>
            <h1>{roomToDisplay?.label}</h1>
            <Grid roomId={roomId ?? ""} margin={7}/>
        </div>
    );
}