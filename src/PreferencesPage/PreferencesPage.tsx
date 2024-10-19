import { Link } from "react-router-dom";
import MenuBar from "../_ui/MenuBar";
import { useContext, useState } from "react";
import { AccountContext } from "../_contexts/AccountContext";
import parseName from "../_ui/parseName";
import { SetAccount } from "../App";
import updateObject from "../_helpers/updateObject";
import Account from "../_types/Account";

import './PreferencesPage.css';
import RatingEntry from "./RatingEntry";
import { md5 } from "../_helpers/md5";
import RatingType from "../_types/RatingType";

export default function PreferencesPage(){
    
	const account = useContext(AccountContext);

    const ratingEntries = Object.entries(account?.ratingTypes ?? {}).map(
        ([ratingId, ratingType])=>{
            return <RatingEntry key={ratingId} ratingId={ratingId} ratingType={ratingType}></RatingEntry>;
        }
    );

    function addRatingType(){
        const id = md5(Date.now()+"RT");
        if(!account)
            return;
        const updateAccount = {
            ratingTypes:{
                [id]:new RatingType()
            }
        };

        SetAccount(updateObject<Account>(account, updateAccount));
    }


    //#region StudentLabeling
    const [studentLabelExample, setStudentLabelExample] = useState<string>("Musterschüler, Hannah Maximilian (Hama)");

    const studentLabelingOptions:{
        label: string,
        value: string,
        description: string,
    }[] = [
        {
            label: 'Voller Name',
            value: '',
            description: 'Den vollen Namen des Schülers darstellen.'
        },
        {
            label: 'Spitzname, 1ster Vorname [Nachname, Vornamen (Spitzname)]',
            value: 'nick',
            description: 'Den Spitznamen des Schülers darstellen. Dieser ist in Klammern aufgeführt. Falls kein Spitzname vorhanden ist, wird der erste Vorname des Schülers verwendet.'
        }
    ]; 
    
    const studentLabelingOptionInputs = studentLabelingOptions.map((option)=>{
        if(!account)
            return <></>;
        return(
            <div key={option.value}>
                <input type="radio"
                    value={option.value}
                    defaultChecked={account?.preferences.studentLabeling === option.value}
                    onChange={(e)=>{if(e.target.checked)SetAccount(updateObject<Account>(account,{preferences:{studentLabeling: e.target.value}}))}}
                    name="studentLabeling"
                />
                <label>{option.label}</label>
                <span>{option.description}</span>
                <span>Beispiel: {parseName(studentLabelExample,option.value)}</span>
            </div>
        );
    });
    //#endregion
    
    return (
        <div className="page">
            <MenuBar>
                <Link to={"/"}>Startseite</Link>
            </MenuBar>
            <h1>Einstellungen</h1>
            <details>
                <summary>Bewertungsoptionen</summary>
                <p>Die Farben sind in HSL angegeben (<a href="https://www.w3schools.com/colors/colors_hsl.asp">Hilfs-Werkzeug</a>)</p>
                {ratingEntries}
                <button onClick={addRatingType}>Neue Bewertungsoption</button>
            </details>
            <details>
                <summary>Schüler-Namen-Anzeige</summary>
                <p>Beispiel-Name: <input defaultValue={studentLabelExample} onChange={(e)=>setStudentLabelExample(e.target.value)}></input></p>
                {studentLabelingOptionInputs}
            </details>
        </div>
    );
}