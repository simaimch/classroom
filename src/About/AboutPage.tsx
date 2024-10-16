import { Link } from "react-router-dom";
import AboutWidget from "./AboutWidget";

export default function AboutPage(){
    return (
        <div className="page">
            <div className="MenuBar">
            	<Link to={"/"}>Startseite</Link>
			</div>
            <AboutWidget><></></AboutWidget>
        </div>
    );
}