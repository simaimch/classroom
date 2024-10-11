import Student from "../_types/Student";
import StudentMoveOverlay from "./StudentMoveOverlay";

import './StudentWidget.css';

export default function StudentWidget(
    {
        student,
        inEditMode,
        moveFunction,
    }
    :
    {
        student:Student,
        inEditMode:boolean,
        moveFunction:(deltaX:number,deltaY:number)=>any,
    }
){
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


    return (
        <div className={classes.join(" ")} style={style}>
            {
                inEditMode && <StudentMoveOverlay moveFunction={moveFunction}></StudentMoveOverlay>
            }
            <span className="studentName">{student.name}</span>
        </div>
    );
}