import AboutWidget from '../About/AboutWidget';
import './WelcomePage.css';

export default function WelcomePage(
    {start}
    :
    {start: ()=>any}
){

    

    return(
        <div className="page" id="welcomePage">
            <AboutWidget>
                <p>
                    <button onClick={start}>Ich verstehe, dass ich diese Seite/Anwendung auf eigene Gefahr nutze.</button>
                </p>
            </AboutWidget>

        </div>
        
    );
}