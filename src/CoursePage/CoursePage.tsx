import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";
import StudentEntry from "./StudentEntry";
import Student from "../_types/Student";
import Account from "../Account";
import { SetAccount } from "../App";
import updateObject from "../_helpers/updateObject";
import Lesson from "../_types/Lesson";
import StudentLesson from "../_types/StudentLesson";

export default function CoursePage(){
	let {courseId} = useParams();
	const account = useContext(AccountContext);

	const navigate = useNavigate();

	const courseToDisplay = account?.courses[courseId ?? ""];

	const [newStudentLabel, setNewStudentLabel] = useState<string>("");
	const [newStudentLabelErrorMessage, setNewStudentLabelErrorMessage] = useState<string>('');

	const lessonsList = Object.entries(courseToDisplay?.lessons ?? {})
		.map(
			([id,lesson]) =>
			{
				return	<li key={id} onClick={(e)=>{navigate(`lesson/${id}`)}}>
							{id}
						</li>
			}
		);

	const studentsList = Object.entries(courseToDisplay?.students ?? {})
		.sort(([idA,studentA],[idB,studentB])=>studentA.name.localeCompare(studentB.name))
		.map(
			([id, student]) => 
			{
				return  <li key={id}>
							<StudentEntry student={student} deleteFunction={()=>{deleteStudent(id)}}></StudentEntry>
						</li>
			}
		)

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
		const newStudentId = newStudentLabel;
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
		const newLessonId = `${Object.keys(courseToDisplay.lessons).length}`;
		const newLesson = new Lesson();
		for(const [studentId, student] of Object.entries(courseToDisplay.students)){
			const studentOfLesson:StudentLesson = {...student};
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
			<h1>{courseToDisplay?.label}</h1>
			<Link to="layout">Sitzplan</Link>
			<button onClick={startLesson}>Unterricht starten</button>
			<h2>Schüler</h2>
			<ul>
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
			<ul>{lessonsList}</ul>
		</div>
	);
}