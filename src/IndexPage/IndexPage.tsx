import { useContext, useState } from "react";
import { AccountContext } from "../_contexts/AccountContext";
import { SetAccount } from "../App";
import Account from "../_types/Account";
import Course from "../_types/Course";
import { md5 } from "../_helpers/md5";
import CourseEntry from "./CourseEntry";

import './IndexPage.css';
import '../_ui/List.css';
import { useNavigate } from "react-router-dom";
import MenuBar from "../_ui/MenuBar";

export default function IndexPage(){

	const account = useContext(AccountContext);

	const [newClassLabel, setNewClassLabel] = useState<string>("");
	const [newClassLabelErrorMessage, setNewClassLabelErrorMessage] = useState<string>('');

	const navigate = useNavigate();

	const coursesList = Object.entries(account?.courses ?? {}).map(
		([id, course]) => {
			return  <li className="entry" key={id} onClick={()=>{navigate(`course/${id}`)}}>
						<CourseEntry 
							course={course} 
							deleteFunction={()=>{deleteCourse(id);}} ></CourseEntry>
					</li>
		}
	)

	function deleteCourse(courseId:string){
		if(!account){
			console.warn("No context");
			return;
		}

		const courses = {...(account.courses)};
		delete courses[courseId];
		const newAccount:Account = {...account, courses: courses};

		SetAccount(newAccount);
	}

	function newCourse(){
		if(!account){
			console.warn("No context");
			return;
		}

		const newLabel = newClassLabel;
		const newId = md5(newLabel+(Date.now()).toString());

		if(account.courses[newId]){
			setNewClassLabelErrorMessage("Eine Klasse mit dieser ID existiert bereits");
			return;
		}

		const newCourse = new Course();
		newCourse.label = newLabel;

		const newCourses:{[key:string]:Course} = {};
		newCourses[newId] = newCourse;
		const courses = {...(account.courses),...newCourses};

		const newAccount:Account = {...account, courses: courses};

		SetAccount(newAccount);

	}


	return (
		<div className="page" id="indexPage">
			<MenuBar><></></MenuBar>
			<h1>Classrooms</h1>
			<h2>Klassen</h2>
			<ul id="coursesList" className="List">
				{coursesList}
			</ul>
			Neue Klasse:
			<input type="text" id="newCourseName" defaultValue={""} placeholder="Klassenname" onChange={(e)=>{setNewClassLabel(e.target.value); setNewClassLabelErrorMessage("")}}></input>
			<button onClick={newCourse}>erstellen</button>
			{
				newClassLabelErrorMessage && (
					<div className="error">{newClassLabelErrorMessage}</div>
				)
			}
		</div>
	);
}