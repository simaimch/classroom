import { Link } from "react-router-dom";

export default function MenuBar(
    {children}:{children:any}
){
    return(
        <div className="MenuBar">
            {children}
            <Link to="/preferences" className="rightAligned">Einstellungen</Link>
            <Link to="/about" className="rightAligned">About</Link>
        </div>
    );
}