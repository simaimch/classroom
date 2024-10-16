import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";
import "./LessonPage.css";
import StudentWidget from "./StudentWidget";
import MenuBar from "./LessonMenuBar";
import StudentLesson from "../_types/StudentLesson";
import Account from "../_types/Account";
import updateObject from "../_helpers/updateObject";
import { SetAccount } from "../App";
import RatingWidget from "./RatingWidget";
import LessonMenuBar from "./LessonMenuBar";

export default function LessonPage(){
    let {courseId, lessonId} = useParams();
	const account = useContext(AccountContext);

    const [editMode, setEditMode] = useState<boolean>(false);

    const [selectedRating,setSelectedRating] = useState<string>("");

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

    function addRatingFunction(student:StudentLesson, ratingId:string, inc:number=1){
        return function(){
            const targetRating = (student.ratings[selectedRating] || 0)+inc;
            setRating(student, ratingId, targetRating);
        }
    }

    function setRating(student:StudentLesson, ratingId:string, targetValue:number){
        if(!account || !courseId || !lessonId)
            return;

        const updateCourse:{[key:string]:any} = {lessons:{[lessonId]:{students:{[student.id]:{ratings:{[ratingId]:targetValue}}}}}};
        const updateAccount:{[key:string]:any} = {courses:{[courseId]: updateCourse}};
        SetAccount(updateObject<Account>(account,updateAccount));
    }

    function moveFunction(student:StudentLesson):(deltaX:number,deltaY:number)=>any{
        return function(deltaX:number,deltaY:number){
			if(!account)
				throw new Error("Account unset");
			const targetPosition = [student.sitzplatz[0]+deltaX,student.sitzplatz[1]+deltaY];
			const studentAtTargetPosition = studentByPosition(targetPosition[0],targetPosition[1]);
			const updateLesson:{[key:string]:any} = {students:{}};

			const updateSutdent:StudentLesson = {...student};
			updateSutdent.sitzplatz = targetPosition;

			updateLesson.students[updateSutdent.id] = updateSutdent;

			if(studentAtTargetPosition){
				const updateStudentAtTarget:StudentLesson = {...studentAtTargetPosition, sitzplatz: student.sitzplatz};
				updateLesson.students[updateStudentAtTarget.id] = updateStudentAtTarget;
			}

			const updateCourse:{[key:string]:any} = {lessons:{}};
			updateCourse.lessons[lessonId ?? ""] = updateLesson;

			const updateAccount:{[key:string]:any} = {courses:{}};
			updateAccount.courses[courseId ?? ""] = updateCourse;

			SetAccount(updateObject<Account>(account,updateAccount));
        }
    }

    function saveLayout(){
        if(!account)
            throw new Error("Account unset");

        if(!courseId)
            throw new Error("courseId unset");

        if(!lessonId)
            throw new Error("lessonId unset");

        const updateCourse:{[key:string]:any} = {students:{}};
        
        for(const [studentId,student] of Object.entries(lessonToDisplay.students)){
            updateCourse.students[studentId] = {sitzplatz: student.sitzplatz};
        }

        const updateAccount:{[key:string]:any} = {courses:{[courseId]: updateCourse}};

        console.warn(updateAccount);

        SetAccount(updateObject<Account>(account,updateAccount));
    }

    function studentByPosition(x:number, y:number){
		return Object.values(lessonToDisplay.students).find((student)=>student.sitzplatz[0]===x&&student.sitzplatz[1]===y);
    }

    function undo(){

    }

    const ratings = Object.entries(account.ratingTypes).map(([id,ratingType])=>{
        const style = {
            background: `hsl(${ratingType.color[0]}, ${ratingType.color[1]*100}%, ${ratingType.color[2]*100}%)`,
            color:ratingType.color[2] >= 0.35 ? 'black' : 'white',
        };
        return (
            <div key={id} style={style} className={"rating"+(selectedRating === id ? " selected" : "")} onClick={(e)=>{setSelectedRating(id)}}>
                <RatingWidget ratingType={ratingType}></RatingWidget>
            </div>
        )
    });

    const students = Object.entries(lessonToDisplay.students).map(([id,student])=>{
        return (
            <div className="container" key={id}>
                <StudentWidget
                    student={student}
                    inEditMode={editMode}
                    moveFunction={moveFunction(student)}
                    addRatingFunction={addRatingFunction(student, selectedRating)}
                ></StudentWidget>
            </div>
        );
    });

    return(
        <div className="lesson">
            <h1>{courseToDisplay?.label}, Unterricht {lessonId}</h1>
            <LessonMenuBar 
				editMode={editMode} 
				setEditMode={setEditMode} 
				saveLayout={saveLayout}
                undoFunction={undo}></LessonMenuBar>
            <div className="students" style={studentsStyle}>
                {students}
            </div>
            <div className="ratings">
                {ratings}
            </div>
        </div>
    );
}