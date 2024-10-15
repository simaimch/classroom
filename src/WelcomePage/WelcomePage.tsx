import { useContext } from 'react';
import updateObject from '../_helpers/updateObject';
import { SetAccount } from '../App';
import logo from './Logo.png';
import './WelcomePage.css';
import { AccountContext } from '../_contexts/AccountContext';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage(
    {start}
    :
    {start: ()=>any}
){

    

    return(
        <div className="page" id="welcomePage">
            <h1>Classroom</h1>
            <h2>Was ist das hier?</h2>
            <p>
                Ein Tool, das ich geschrieben habe, um mir die mündliche Bewertung meiner Klassen zu vereinfachen,
                und das ich, auf Nachfrage zahlreicher Kollegen, der Öffentlichkeit zu Verfügung stelle.
            </p>

            <h2>Was muss ich bei der Verwendung dieser Software beachten?</h2>
            <p>
                Ich übernehme keinerlei Gewähr hinsichtlich der Funktionsfähigkeit und Bereitstellung dieser Seite.
            </p>

            <h2>Kriege ich irgendwo eine Offline-Variante dieser Anwendung?</h2>
            <p>
                Ja, auf der <a href="https://github.com/simaimch/classroom">GitHub-Seite dieses Projektes</a>. Es ist dafür erforderlich npm installiert zu haben. Dann führt man <code>npm i</code> und danach <code>npm run build</code> in der Kommandozeile aus.
            </p>

            <h2>Was ist mit dem Datenschutz?</h2>
            <p>
                Die Daten, die auf dieser Seite eingetragen werden,
                werden nicht über das Internet übertragen und entsprechend auch auf keinem externen Server gespeichert.
            </p>

            <h2>Bedeutet das, dass ich meine Dateien nicht von meinem Tablet auf z.B. meinen PC übertragen kann?</h2>
            <p>Ja.</p>

            <h2>Wo genau sind die Daten gespeichert?</h2>
            <p>
                Im Local Storage des Webbrowsers. Bei üblichen Browsern und auf sicheren Geräten sind sie dort vor unbefugtem Zugriff sicher.
            </p>

            <h2>Kann ich bei der Entwicklung dieser Anwendung helfen?</h2>
            <p>
                Ja, auf der <a href="https://github.com/simaimch/classroom">GitHub-Seite dieses Projektes</a> findet sich der Quellcode.
                Dahin gerne Merge-requests senden.
                Ohne Kenntnisse in Git, TypeScript, HTML und ReactJS wird das aber leider schwierig.
            </p>

            <p>
                <button onClick={start}>Ich verstehe, dass ich diese Seite/Anwendung auf eigene Gefahr nutze.</button>
            </p>

            <img id="logo" src={logo}/>
            <p>Christian Hoffmann, Edufant 2024</p>
        </div>
        
    );
}