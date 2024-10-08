import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";
import "./LessonPage.css";
import StudentWidget from "./StudentWidget";
import MenuBar from "./MenuBar";

export default function LessonPage(){
    let {courseId, lessonId} = useParams();
	const account = useContext(AccountContext);

    const navigate = useNavigate();

    const [editMode, setEditMode] = useState<boolean>(false);

    if(!account)
        return (<>Account connection failed</>);
    if(!courseId)
        return (<>Course Id Error</>);
    if(!lessonId)
        return (<>Lesson Id Error</>);

    

	

	const courseToDisplay = account.courses[courseId];
    const lessonToDisplay = courseToDisplay.lessons[lessonId];

    const layoutWidth = Object.entries(lessonToDisplay.students).reduce((prev,current)=>Math.max(prev,current[1].sitzplatz[0]),4);
    const laxoutHeight = Object.entries(lessonToDisplay.students).reduce((prev,current)=>Math.max(prev,current[1].sitzplatz[1]),4);

    const studentsStyle = {
        "--rowCount": laxoutHeight,
        "--columnCount": layoutWidth,
    } as React.CSSProperties;

    const students = Object.entries(lessonToDisplay.students).map(([id,student])=>{
        return (
            <div className="container" key={id}>
                <StudentWidget student={student}></StudentWidget>
            </div>
        );
    });

    return(
        <div className="page lesson">
            <h1>{courseToDisplay?.label}, Unterricht {lessonId}</h1>
            <MenuBar editMode={editMode} setEditMode={setEditMode} load={function () {
                throw new Error("Function not implemented.");
            } } save={function () {
                throw new Error("Function not implemented.");
            } }></MenuBar>
            <div className="students" style={studentsStyle}>
                {students}
            </div>
        </div>
    );
}