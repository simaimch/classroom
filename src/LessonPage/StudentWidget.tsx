import { useContext } from "react";
import StudentLesson from "../_types/StudentLesson";

import './StudentWidget.css';
import { AccountContext } from "../_contexts/AccountContext";
import StudentLabel from "../_ui/StudentLabel";
import { EEditMode } from "./LessonPage";
import StudentSelectOverlay from "./StudentSelectOverlay";

export default function StudentWidget(
    {
        student,
        inEditMode,
        selectFunction,
        isSelected,
        addRatingFunction,
    }
    :
    {
        student:StudentLesson,
        inEditMode:EEditMode,
        selectFunction:(studentId:string)=>any,
        isSelected:boolean,
        addRatingFunction:()=>any,
    }
){
    const account = useContext(AccountContext);

    if(!account)
        return (<>Account connection failed</>);

    const sitzplatzX = student.sitzplatz[0] || 1;
    const sitzplatzY = student.sitzplatz[1] || 1;

    const style:React.CSSProperties = {
        gridColumn: sitzplatzX,
        gridRow: sitzplatzY
    }

    const classes = ["student"];

    if(inEditMode)
        classes.push("editing");
    if(isSelected)
        classes.push("selected");

    const currentRatings:JSX.Element[] = Object.entries(student.ratings).map(
        ([ratingId, count])=>{
            const rating = account.ratingTypes[ratingId];
            if(!rating)
                return <div key={"none"} style={{"display":"none"}}></div>;
            return <div key={ratingId}>{count}x {rating.label}</div>;
        }
    );

    return (
        <div className={classes.join(" ")} style={style}>
            {
                inEditMode === EEditMode.Layout && <StudentSelectOverlay selectFunction={()=>{selectFunction(student.id)}}></StudentSelectOverlay>
            }
            {
                !inEditMode && <>
                    <div className="currentRatings">{currentRatings}</div>
                    <div className="addRatingOverlay" onClick={addRatingFunction}></div>
                </>
            }
            <StudentLabel student={student}/>
        </div>
    );
}