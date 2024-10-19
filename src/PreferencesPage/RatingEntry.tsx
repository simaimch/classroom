import { useContext, useState } from "react";
import RatingType from "../_types/RatingType";
import arrayToHSL from "../_ui/arrayToHSL";

import './RatingEntry.css';
import { AccountContext } from "../_contexts/AccountContext";
import { SetAccount } from "../App";
import updateObject from "../_helpers/updateObject";
import Account from "../_types/Account";

export default function RatingEntry({
    ratingId,
    ratingType,
}
:{
    ratingId:string,
    ratingType:RatingType,
}){
    const account = useContext(AccountContext);
    const [previewColor, setPreviewColor] = useState<string>(arrayToHSL(ratingType.color));

    function setColor(arr:number[]){
        if(!account)
            return;
        const updateAccount = {
            ratingTypes:{
                [ratingId]:{color: arr}
            }
        };

        const updatedAccount = updateObject<Account>(account, updateAccount);

        SetAccount(updatedAccount);
    }

    function setLabel(newLabel:string){
        if(!account)
            return;
        const updateAccount = {
            ratingTypes:{
                [ratingId]:{label: newLabel}
            }
        };

        SetAccount(updateObject<Account>(account, updateAccount));
    }

    return <div className="ratingType">
        <span className="ratingTypeId">{ratingId}</span>
        <input defaultValue={ratingType.label} onChange={(e)=>{
            const newName = e.target.value.trim();
            if(!newName)
                return;
            setLabel(newName);
        }}></input>
        <input defaultValue={ratingType.color.join(',')} onChange={(e)=>{
            const targetValue = e.target.value;
            const targetArray = targetValue.split(',');
            if(targetArray.length !== 3)
                return;
            const numArray = targetArray.map(s=>Number(s));
            numArray[0] = Math.min(359,Math.max(0,numArray[0]));
            numArray[1] = Math.min(1,Math.max(0,numArray[1]));
            numArray[2] = Math.min(1,Math.max(0,numArray[2]));

            setPreviewColor(arrayToHSL(numArray));
            setColor(numArray);
        }}></input>
        <span className="previewColor" style={{background: previewColor}}></span>
    </div>
}