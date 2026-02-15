import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";
import "./LessonPage.css";
import StudentWidget from "./StudentWidget";
import StudentLesson from "../_types/StudentLesson";
import Account from "../_types/Account";
import updateObject from "../_helpers/updateObject";
import { SetAccount } from "../App";
import RatingWidget from "./RatingWidget";
import LessonMenuBar from "./LessonMenuBar";
import { EditHistoryEntry } from "../_types/Lesson";
import arrayToHSL from "../_ui/arrayToHSL";

export enum EEditMode{
    None,
    Layout,
}

type MoveResult = {
    success: boolean,
    replacedKey: string|null
}

export default function LessonPage(){
    let {courseId, lessonId} = useParams();
	const account = useContext(AccountContext);

    const [editMode, setEditMode] = useState<EEditMode>(EEditMode.None);

    const [selectedRating,setSelectedRating] = useState<string>("");

    const [selectedStudent, setSelectedStudent] = useState<string>("");

    if(!account)
        return (<>Account connection failed</>);
    if(!courseId)
        return (<>Course Id Error</>);
    if(!lessonId)
        return (<>Lesson Id Error</>);

    

	

	const courseToDisplay = account.courses[courseId];
    const lessonToDisplay = courseToDisplay.lessons[lessonId];

    const layoutWidth = Object.entries(lessonToDisplay.students)
                            .reduce((prev,current)=>Math.max(prev,current[1].sitzplatz[0]),4)
                            + (editMode === EEditMode.Layout ? 2 : 0);
    const layoutHeight = Object.entries(lessonToDisplay.students)
                            .reduce((prev,current)=>Math.max(prev,current[1].sitzplatz[1]),4)
                            + (editMode === EEditMode.Layout ? 2 : 0);

    const studentsStyle = {
        "--rowCount": layoutHeight,
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

        const currentValue = student.ratings[ratingId] ?? 0;
        const newEditHistoryEntry: EditHistoryEntry = {
            time: Date.now(),
            operations:{
                "0":{
                    studentId: student.id,
                    previousRatings:{
                        [ratingId]: currentValue
                    }
                }
            }
        };

        const updateCourse:{[key:string]:any} = {
            lessons:{
                [lessonId]:{
                    students:{
                        [student.id]:{
                            ratings:{
                                [ratingId]:targetValue
                            }
                        }
                    },
                    editHistory:{
                        [Object.keys(lessonToDisplay.editHistory ?? {}).length]:newEditHistoryEntry
                    }
                }
            }
        };
        const updateAccount:{[key:string]:any} = {courses:{[courseId]: updateCourse}};
        SetAccount(updateObject<Account>(account,updateAccount));
    }

    function move(studentId:string, destinationX:number, destinationY:number):MoveResult{
        const student = lessonToDisplay.students[studentId];
			if(!account)
				throw new Error("Account unset");
			const targetPosition = [
                Math.max(1,destinationX),
                Math.max(1,destinationY)
            ];
			const studentAtTargetPosition = studentByPosition(targetPosition[0],targetPosition[1]);
            
            const editHistory = (lessonToDisplay.editHistory) ?? {};
			const updateLesson:{[key:string]:any} = {students:{}};

			const updateSutdent:StudentLesson = {...student};
			updateSutdent.sitzplatz = targetPosition;

			updateLesson.students[updateSutdent.id] = updateSutdent;
            
            const editHistoryId = Object.keys(editHistory).length + "";
            editHistory[editHistoryId] = {
                time: Date.now(),
                operations: {
                    '0':{
                        studentId: student.id,
                        previousPosition: student.sitzplatz
                    }
                }
            }

			if(studentAtTargetPosition){
				const updateStudentAtTarget:StudentLesson = {...studentAtTargetPosition, sitzplatz: student.sitzplatz};
				updateLesson.students[updateStudentAtTarget.id] = updateStudentAtTarget;
                editHistory[editHistoryId] = {
                    time: Date.now(),
                    operations: {
                        '1':{
                            studentId: studentAtTargetPosition.id,
                            previousPosition: studentAtTargetPosition.sitzplatz
                        }
                    }
                }
			}

            updateLesson.editHistory = editHistory;

            const updateAccount = {
                courses:{
                    [courseId ?? ""]:{
                        lessons:{
                            [lessonId ?? ""]: updateLesson
                        }
                    }
                }
            }

			SetAccount(updateObject<Account>(account,updateAccount));
        return {
            success: true,
            replacedKey: (studentAtTargetPosition ? studentAtTargetPosition.id : null)
        };
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
        if(!lessonToDisplay.editHistory || !Object.keys(lessonToDisplay.editHistory) || !courseId || !lessonId || !account)
            return;
        const editHistoryId = `${Object.keys(lessonToDisplay.editHistory).length-1}`;
        const lastEditHistoryEntry = lessonToDisplay.editHistory[editHistoryId];
        
        const lessonUpdate:{[key:string]:any} = {students:{}};
        
        for(const operation of Object.values(lastEditHistoryEntry.operations)){
            let studentUpdate = {};

            if(operation.previousPosition){
                //lessonUpdate.students[operation.studentId] = {sitzplatz: operation.previousPosition};
                studentUpdate = {...studentUpdate,sitzplatz: operation.previousPosition};
            }
            if(operation.previousRatings){
                studentUpdate = {...studentUpdate,ratings: operation.previousRatings};
            }
            lessonUpdate.students[operation.studentId] = studentUpdate;
        }

        const accountUpdate = {
            courses:{
                [courseId]:{
                    lessons:{
                        [lessonId]: lessonUpdate
                    }
                }
            }
        }

        SetAccount(updateObject<Account>(account, accountUpdate));

        delete lessonToDisplay.editHistory[editHistoryId];
    }

    const ratings = Object.entries(account.ratingTypes).map(([id,ratingType])=>{
        const style = {
            background: arrayToHSL(ratingType.color),
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
                    selectFunction={(key:string)=>setSelectedStudent(key)}
                    isSelected={id===selectedStudent}
                    addRatingFunction={addRatingFunction(student, selectedRating)}
                ></StudentWidget>
            </div>
        );
    });

    const studentsRepositionTargets:JSX.Element[] = [];
    for(let y=1; y<= layoutHeight; y++){
        for(let x=1; x<= layoutWidth; x++){
            const style:React.CSSProperties = {
                gridColumn: x,
                gridRow: y
            }
            studentsRepositionTargets.push(
                <div className="repositionTarget"
                    style={style}
                    key={`${x}_${y}`}
                    onClick={()=>{
                        const moveResult = move(selectedStudent,x,y);
                        if(moveResult.success){
                            if(moveResult.replacedKey)
                                setSelectedStudent(moveResult.replacedKey);
                            else
                                setSelectedStudent("");
                        }

                    }}>

                </div>
            );
        }
    }


    return(
        <div className="lesson">
            <h1>{courseToDisplay?.label}, Unterricht {lessonId}</h1>
            <LessonMenuBar 
				editMode={editMode} 
				setEditMode={setEditMode} 
				saveLayout={saveLayout}
                undoFunction={Object.keys(lessonToDisplay.editHistory ?? {}).length > 0 ? undo : null}></LessonMenuBar>
            <div className="students" style={studentsStyle}>
                {students}
                {
                    editMode === EEditMode.Layout && selectedStudent !== "" && studentsRepositionTargets
                }
            </div>
            <div className="ratings">
                {ratings}
            </div>
        </div>
    );
}