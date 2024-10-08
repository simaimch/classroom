import { useEffect, useState } from 'react';
import Student from './_types/Student';
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
    //const [studentName,setStudentName] = useState<string>(student.name);


    let cssStyle:React.CSSProperties = {};

    cssStyle.gridColumn = student.sitzplatz[0]; 
    cssStyle.gridRow = student.sitzplatz[1];

    let nameDisplay = <></>;
    if(editMode){
        cssStyle.backgroundColor = '#ff0000';
        nameDisplay = <input type='text' defaultValue={student.name} onBlur={(e)=>{
            //setStudentName(e.target.value);
            student.name = e.target.value;
        }}></input>
    }else{
        nameDisplay = <>{student.name}</>
    }

    //useEffect(()=>{student.name = studentName},[studentName])


    return (
        <div className="StudentView" style={cssStyle}>
            {nameDisplay}
        </div>
    );
}