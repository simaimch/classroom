import { Link } from "react-router-dom";
import MenuBar from "../_ui/MenuBar";
import { useContext } from "react";
import { AccountContext } from "../_contexts/AccountContext";
import parseName from "../_ui/parseName";
import { SetAccount } from "../App";
import updateObject from "../_helpers/updateObject";
import Account from "../_types/Account";

export default function PreferencesPage(){
    
	const account = useContext(AccountContext);

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
            label: 'Spitzname, 1ster Vorname',
            value: 'nick',
            description: 'Den Spitznamen des Schülers darstellen. Dieser ist in Klammern aufgeführt. Falls kein Spitzname vorhanden ist, wird der erste Vorname des Schülers verwendet.'
        }
    ]; 

    const exampleName = "Musterschüler, Hannah Maximilian (Hama)";
    
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
                <span>Beispiel: {parseName(exampleName,option.value)}</span>
            </div>
        );
    });
    
    return (
        <div className="page">
            <MenuBar>
                <Link to={"/"}>Startseite</Link>
            </MenuBar>
            <h1>Einstellungen</h1>
            <h2>Schüler-Namen-Anzeige</h2>
            {studentLabelingOptionInputs}
        </div>
    );
}