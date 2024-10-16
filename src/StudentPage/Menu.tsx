import { Link, useParams } from "react-router-dom";
import '../_ui/MenuBar.css';
import MenuBar from "../_ui/MenuBar";

export default function Menu(){
    let {courseId} = useParams();

    return(
        <MenuBar>
            <Link to={"/"}>Startseite</Link>
            <Link to={`/course/${courseId}`}>Klassenübersicht</Link>
        </MenuBar>
    );
}