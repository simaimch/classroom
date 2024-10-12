import { useContext } from "react";
import Student from "../_types/Student";
import StudentLesson from "../_types/StudentLesson";
import StudentMoveOverlay from "./StudentMoveOverlay";

import './StudentWidget.css';
import { AccountContext } from "../_contexts/AccountContext";

export default function StudentWidget(
    {
        student,
        inEditMode,
        moveFunction,
        addRatingFunction,
    }
    :
    {
        student:StudentLesson,
        inEditMode:boolean,
        moveFunction:(deltaX:number,deltaY:number)=>any,
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
        gridRow: sitzplatzY,
        color: 'red'
    }

    const classes = ["student"];

    if(inEditMode)
        classes.push("editing");

    const currentRatings = Object.entries(student.ratings).map(
        ([ratingId, count])=>{
            const rating = account.ratingTypes[ratingId];
            if(!rating)
                return <></>;
            return <div key={ratingId}>{count}x {rating.label}</div>;
        }
    );

    return (
        <div className={classes.join(" ")} style={style}>
            {
                inEditMode && <StudentMoveOverlay moveFunction={moveFunction}></StudentMoveOverlay>
            }
            {
                !inEditMode && <>
                    <div className="currentRatings">{currentRatings}</div>
                    <div className="addRatingOverlay" onClick={addRatingFunction}></div>
                </>
            }
            <span className="studentName">{student.name}</span>
        </div>
    );
}