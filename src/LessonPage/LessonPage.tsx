import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";
import "./LessonPage.css";
import Account from "../_types/Account";
import updateObject from "../_helpers/updateObject";
import { SetAccount } from "../App";
import RatingWidget from "./RatingWidget";
import LessonMenuBar from "./LessonMenuBar";
import arrayToHSL from "../_ui/arrayToHSL";
import type { DeepPartial } from "../_helpers/DeepPartial";
import type { Place } from "../_types/Place";
import type Student from "../_types/Student";
import parseName from "../_ui/parseName";

const CELL = 32;
const MARGIN = 2;

export enum EEditMode{
    None,
    Layout,
}

export default function LessonPage(){
    let {courseId, lessonId} = useParams();
	const account = useContext(AccountContext);

    const [editMode, setEditMode] = useState<EEditMode>(EEditMode.None);

    const [selectedRating,setSelectedRating] = useState<string>("");

    const [selectedStudentId, setSelectedStudentId] = useState<string>("");

    if(!account)
        return (<>Account connection failed</>);
    if(!courseId)
        return (<>Course Id Error</>);
    if(!lessonId)
        return (<>Lesson Id Error</>);

	const courseToDisplay = account.courses[courseId];
    const lessonToDisplay = courseToDisplay.lessons[lessonId];

    const roomId = lessonToDisplay.roomId;
    const room = roomId ? account.rooms[roomId] : null;

    type PlaceWithSeatedStudent = Place & {
        student: Student & {id: string};
    }

    const seats: Record<string, PlaceWithSeatedStudent> = useMemo(()=> room ? Object.fromEntries(Object.entries(room.places).map(([placeId,place])=>{
        const studentSittingHereForThisLesson = Object.entries(lessonToDisplay.students).find(([_studentId, student])=>student.placeIdByRoom[roomId] == placeId);

        if(studentSittingHereForThisLesson)
            return [placeId, { ...place, student: { ...studentSittingHereForThisLesson[1], id: studentSittingHereForThisLesson[0] }}];

        const studentSittingHereForThisCourse = Object.entries(courseToDisplay.students).find(([_studentId, student]) => student.placeIdByRoom[roomId] == placeId);
        if (studentSittingHereForThisCourse){
            const studentSittingHereForThisCourseId = studentSittingHereForThisCourse[0];
            const studentHasLeftHisPlaceForThisLesson = lessonToDisplay.students[studentSittingHereForThisCourseId].placeIdByRoom[roomId] == "-";
            if(!studentHasLeftHisPlaceForThisLesson)
                return [placeId, { ...place, student: { ...studentSittingHereForThisCourse[1], id: studentSittingHereForThisCourse[0] } }];
        }

        return [placeId,{...place, studentId: null}];
    })) : {},[account]);

    const unseatedStudents = Object.fromEntries(
                                Object.entries(courseToDisplay.students)
                                    .filter(([studentId,_student])=>!Object.entries(seats).find(([_seatId,seat])=>seat.student?.id == studentId))
                            );

    const bounds = useMemo(() => {
        if (Object.entries(seats).length === 0) {
                return {
                    minX: -MARGIN,
                    maxX: MARGIN,
                    minY: -MARGIN,
                    maxY: MARGIN,
                };
            }
    
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;
    
         Object.values(seats).forEach(r => {
                minX = Math.min(minX, r.x);
                minY = Math.min(minY, r.y);
                maxX = Math.max(maxX, r.x + r.width);
                maxY = Math.max(maxY, r.y + r.height);
            });
    
            return {
                minX: minX - MARGIN,
                minY: minY - MARGIN,
                maxX: maxX + MARGIN,
                maxY: maxY + MARGIN,
            };
    }, [seats]);


    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;



    /*function addRatingFunction(student:StudentLesson, ratingId:string, inc:number=1){
        return function(){
            const targetRating = (student.ratings[selectedRating] || 0)+inc;
            setRating(student, ratingId, targetRating);
        }
    }*/

    /*function setRating(student:StudentLesson, ratingId:string, targetValue:number){
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
    }*/

    function saveLayout(){
        if(!account)
            throw new Error("Account unset");

        if(!courseId)
            throw new Error("courseId unset");

        if(!lessonId)
            throw new Error("lessonId unset");

        
        let updateAccount = {

        };

        for(const [studentId, student] of Object.entries(lessonToDisplay.students)){
            updateAccount = updateObject(updateAccount,{
                courses:{
                    [courseId]:{
                        students:{
                            [studentId]:{
                                placeIdByRoom:{
                                    [roomId]: student.placeIdByRoom[roomId]
                                }
                            }
                        }
                    }
                }
            });
        }

        SetAccount(updateObject<Account>(account,updateAccount));
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

    function roomChange(roomId: string){
        if (!account)
            throw new Error("Account unset");

        if (!courseId)
            throw new Error("courseId unset");

        if (!lessonId)
            throw new Error("lessonId unset");

        const updateAccount: DeepPartial<Account>= {courses: {[courseId]:{lessons:{[lessonId]:{roomId: roomId}}}}};

        SetAccount(updateObject<Account>(account, updateAccount));
    }

    const ratings = Object.entries(account.ratingTypes).map(([id,ratingType])=>{
        const style = {
            background: arrayToHSL(ratingType.color),
            color:ratingType.color[2] >= 0.35 ? 'black' : 'white',
        };
        return (
            <div key={id} style={style} className={"rating"+(selectedRating === id ? " selected" : "")} onClick={(_e)=>{setSelectedRating(id)}}>
                <RatingWidget ratingType={ratingType}></RatingWidget>
            </div>
        )
    });


    function handleClick(placeId:string){
        if(selectedStudentId){
            seatStudent(placeId, selectedStudentId);
            setSelectedStudentId("");
        }
    }

    function seatStudent(placeId:string, studentId:string){
        if(!room || !courseId || !lessonId || !account) return;
        
        const place = seats[placeId];
        if(!place) return;

        const studentOnThisPlace = place.student?.id;
        if(studentOnThisPlace == studentId) return;

        if(!studentOnThisPlace){
            SetAccount(updateObject(account, { courses: { [courseId]: { lessons: { [lessonId]: { students: { [studentId]: { placeIdByRoom: { [roomId]: placeId } } }}}}}}));
        }else{
            SetAccount(updateObject(account, { courses: { [courseId]: { lessons: { [lessonId]: { students: 
                { 
                    [studentId]: { placeIdByRoom: {[roomId]: placeId} },
                    [studentOnThisPlace]: { placeIdByRoom: { [roomId]: "-" } },
                } 
            } } } } }));
        }
        
    }

    function handleRightClick(){

    }

    const svgPlaces = Object.entries(seats).map(([placeId, placeWithStudentId]) => {

        const x = (placeWithStudentId.x - bounds.minX) * CELL;
        const y = (placeWithStudentId.y - bounds.minY) * CELL;
        const w = placeWithStudentId.width * CELL;
        const h = placeWithStudentId.height * CELL;

        return <g key={placeId}>
                <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="steelblue"
                    stroke="black"
                    onClick={() => handleClick(placeId)}
                />
                {placeWithStudentId.student && 
                    <text
                        x={x + w / 2}
                        y={y + h / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={Math.min(w, h) * 0.4}
                        fill="white"
                        pointerEvents="none"
                    >
                        {parseName(placeWithStudentId.student.name, account?.preferences.studentLabeling ?? "")}
                    </text>
                }
            </g>
    })

    return(
        <div className="lesson">
            <h1>{courseToDisplay?.label}, Unterricht {lessonId}</h1>
            <LessonMenuBar 
                editMode={editMode}
                setEditMode={setEditMode}
                saveLayout={saveLayout}
                undoFunction={Object.keys(lessonToDisplay.editHistory ?? {}).length > 0 ? undo : null} onRoomChange={roomChange}></LessonMenuBar>

            <div id="unseatedStudents">
                <ul>
                    {Object.entries(unseatedStudents).map(([studentId,student])=>
                        <li 
                            key={studentId}
                            onClick={() => setSelectedStudentId(studentId)}
                            className={selectedStudentId == studentId ? "selected": ""}
                        >{student.name}</li>
                    )}
                </ul>
            </div>
            <div id="seatedStudents">
                <svg
                    viewBox={`0 0 ${width*CELL} ${height*CELL}`}
                    onContextMenu={handleRightClick}
                    preserveAspectRatio="xMidYMid meet"
                    style={{ border: "1px solid black" }}
                >

                    {svgPlaces}

                </svg>
            </div>
            <div className="ratings">
                {ratings}
            </div>
        </div>
    );
}