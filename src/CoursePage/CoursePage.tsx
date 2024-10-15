import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";
import StudentEntry from "./StudentEntry";
import Student from "../_types/Student";
import Account from "../_types/Account";
import { SetAccount } from "../App";
import updateObject from "../_helpers/updateObject";
import Lesson from "../_types/Lesson";
import StudentLesson from "../_types/StudentLesson";

import '../_ui/List.css';
import '../_ui/Page.css';
import LessonEntry from "./LessonEntry";
import { md5 } from "../_helpers/md5";

export default function CoursePage(){
	let {courseId} = useParams();
	const account = useContext(AccountContext);

	const navigate = useNavigate();

	const courseToDisplay = account?.courses[courseId ?? ""];

	const [newStudentLabel, setNewStudentLabel] = useState<string>("");
	const [newStudentLabelErrorMessage, setNewStudentLabelErrorMessage] = useState<string>('');

	function dateToTimeAgoCategory(date:Date){
		const day = Math.floor(date.getTime() / 86400000);
		const dayToday = Math.floor(Date.now() / 86400000);

		const daysDifference = dayToday - day;
		if(daysDifference === 0)
			return "Heute";
		if(daysDifference === 1)
			return "Gestern";
		
		const mondayOfDay = new Date((date.getTime() / 86400000 - (date.getDay() ?? 7) + 1) * 86400000);
		const sundayOfDay = new Date(mondayOfDay.getTime() + 518400000);

		return `${mondayOfDay.toLocaleDateString()} - ${sundayOfDay.toLocaleDateString()}`;
	}

	let lastTimeAgoCategory = "";

	const lessonsEntries:JSX.Element[] = [];

	Object.entries(courseToDisplay?.lessons ?? {})
		.sort(([lidA,lessonA],[lidB,lessonB])=>lessonB.timeStart-lessonA.timeStart)
		.forEach(
			([id,lesson]) =>
			{
				let timeAgoDOM = <></>;
				const timeAgoCategory = dateToTimeAgoCategory(new Date(lesson.timeStart));
				if(timeAgoCategory !== lastTimeAgoCategory){
					lastTimeAgoCategory = timeAgoCategory;
					lessonsEntries.push(<li className="header" key={lastTimeAgoCategory}><div className="label">{lastTimeAgoCategory}</div></li>);
				}
				lessonsEntries.push(
						<li className="entry" key={id} onClick={(e)=>{navigate(`lesson/${id}`)}}>
							<LessonEntry lesson={lesson} deleteFunction={()=>deleteLesson(id)}></LessonEntry>
							
						</li>);

			}
		);

	const studentsList = Object.entries(courseToDisplay?.students ?? {})
		.sort(([idA,studentA],[idB,studentB])=>studentA.name.localeCompare(studentB.name))
		.map(
			([id, student]) => 
			{
				return  <li key={id} className="entry" onClick={()=>{navigate(`student/${id}`)}}>
							<StudentEntry 
								student={student} 
								deleteFunction={()=>{deleteStudent(id)}}
							></StudentEntry>
						</li>
			}
		)

	function deleteLesson(lessonId:string){
		if(!courseToDisplay || !courseId)
			return;

		const accountUpdate:{[key:string]:any} = {courses:{[courseId]:{lessons:{[lessonId]:null}}}};

		SetAccount(updateObject<Account>(account,accountUpdate));
	}

	function deleteStudent(studentId:string){
		if(!courseToDisplay)
			return;

		const accountUpdate:{[key:string]:any} = {courses:{}};
		const courseUpdate:{[key:string]:any} = {students:{}};
		accountUpdate.courses[courseId ?? ""] = courseUpdate;
		courseUpdate.students[studentId] = null;

		SetAccount(updateObject<Account>(account,accountUpdate));
	}

	function newStudent(){
		

		if(!courseToDisplay)
			return;

		const newStudent = new Student();
		newStudent.name = newStudentLabel;
		const newStudentId = md5(newStudentLabel+(Date.now()).toString());
		newStudent.id = newStudentId;

		const accountUpdate:{[key:string]:any} = {courses:{}};
		const courseUpdate:{[key:string]:any} = {students:{}};
		accountUpdate.courses[courseId ?? ""] = courseUpdate;
		courseUpdate.students[newStudentId] = newStudent;

		SetAccount(updateObject<Account>(account,accountUpdate));
		
	}

	function startLesson(){
		if(!courseToDisplay)
			return;
		const newLessonId = md5(Object.keys(courseToDisplay.lessons).length+(Date.now()).toString());
		const newLesson = new Lesson();
		newLesson.timeStart = Date.now();
		for(const [studentId, student] of Object.entries(courseToDisplay.students)){
			const studentOfLesson:StudentLesson = {...student, ratings: {}};
			newLesson.students[studentId] = studentOfLesson;
		}

		const accountUpdate:{[key:string]:any} = {courses:{}};
		const courseUpdate:{[key:string]:any} = {lessons:{}};
		accountUpdate.courses[courseId ?? ""] = courseUpdate;
		courseUpdate.lessons[newLessonId] = newLesson;

		SetAccount(updateObject<Account>(account,accountUpdate));

		navigate(`lesson/${newLessonId}`);
	}

	return(
		<div className="page">
			<div className="MenuBar">
            	<Link to={"/"}>Startseite</Link>
			</div>
			<h1>{courseToDisplay?.label}</h1>
			<button onClick={startLesson}>Unterricht starten</button>
			<h2>Schüler</h2>
			<ul className="List">
				{studentsList}
			</ul>
			Neuer Schüler:
			<input type="text" id="newStudentName" defaultValue={""} placeholder="Schüler Name" onChange={(e)=>{setNewStudentLabel(e.target.value); setNewStudentLabelErrorMessage("")}}></input>
			<button onClick={newStudent}>erstellen</button>
			{
				newStudentLabelErrorMessage && (
					<div className="error">{newStudentLabelErrorMessage}</div>
				)
			}

			<h2>Unterrichtseinheiten</h2>
			<ul className="List">{lessonsEntries}</ul>
		</div>
	);
}