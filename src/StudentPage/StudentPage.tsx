import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";

export default function StudentPage(){
    let {courseId, studentId} = useParams();
	const account = useContext(AccountContext);

    if(!account)
        return (<>Account connection failed</>);
    if(!courseId)
        return (<>Course Id Error</>);
    if(!studentId)
        return (<>Student Id Error</>);

    const course = account.courses[courseId];
    const student = course.students[studentId];

    return(
        <div className="page">
            <h1>{student.name} ({course.label})</h1>
        </div>
    );
}