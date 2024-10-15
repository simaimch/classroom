import { Link, useParams } from "react-router-dom";
import '../_ui/MenuBar.css';

export default function Menu(){
    let {courseId} = useParams();

    return(
        <div className="MenuBar">
            <Link to={"/"}>Startseite</Link>
            <Link to={`/course/${courseId}`}>Klassenübersicht</Link>
        </div>
    );
}