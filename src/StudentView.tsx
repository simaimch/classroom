import Student from './Student';
import './StudentView.css';

export default function StudentView(
    {
        student,
        editMode,
    }:{
        student: Student,
        editMode: boolean,
    }
){

    let cssStyle:React.CSSProperties = {};

    cssStyle.gridColumn = student.sitzplatz[0]; 
    cssStyle.gridRow = student.sitzplatz[1];

    if(editMode)
        cssStyle.backgroundColor = '#ff0000';

    return (
        <div className="StudentView" style={cssStyle}>
            {student.name}
        </div>
    );
}