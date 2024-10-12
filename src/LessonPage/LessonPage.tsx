import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";
import "./LessonPage.css";
import StudentWidget from "./StudentWidget";
import MenuBar from "./MenuBar";
import Lesson from "../_types/Lesson";
import StudentLesson from "../_types/StudentLesson";
import Account from "../_types/Account";
import updateObject from "../_helpers/updateObject";
import { SetAccount } from "../App";
import RatingWidget from "./RatingWidget";

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

    function addRatingFunction(student:StudentLesson, ratingId:string){
        return function(){
            if(!account || !courseId || !lessonId)
                return;
            const updateCourse:{[key:string]:any} = {lessons:{[lessonId]:{students:{[student.id]:{ratings:{[selectedRating]:(student.ratings[selectedRating] || 0)+1}}}}}};
            const updateAccount:{[key:string]:any} = {courses:{[courseId]: updateCourse}};
            SetAccount(updateObject<Account>(account,updateAccount));
        }
    }

    function moveFunction(student:StudentLesson):(deltaX:number,deltaY:number)=>any{
        return function(deltaX:number,deltaY:number){
			if(!account)
				throw new Error("Account unset");
			const targetPosition = [student.sitzplatz[0]+deltaX,student.sitzplatz[1]+deltaY];
			const studentAtTargetPosition = studentByPosition(targetPosition[0],targetPosition[1]);
			const updateLesson:Lesson = {students:{}};

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

    const ratings = Object.entries(account.ratingTypes).map(([id,ratingType])=>{
        return (
            <div key={id} className={"rating"+(selectedRating === id ? " selected" : "")} onClick={(e)=>{setSelectedRating(id)}}>
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
        <div className="page lesson">
            <h1>{courseToDisplay?.label}, Unterricht {lessonId}</h1>
            <MenuBar 
				editMode={editMode} 
				setEditMode={setEditMode} 
				saveLayout={saveLayout}></MenuBar>
            <div className="students" style={studentsStyle}>
                {students}
            </div>
            <div className="ratings">
                {ratings}
            </div>
        </div>
    );
}