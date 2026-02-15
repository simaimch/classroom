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
import RoomEntry from "./RoomEntry";
import Room from "../_types/Room";

export default function IndexPage(){

	const account = useContext(AccountContext);

	const [newClassLabel, setNewClassLabel] = useState<string>("");
	const [newClassLabelErrorMessage, setNewClassLabelErrorMessage] = useState<string>('');

	const [newRoomLabel, setNewRoomLabel] = useState<string>("");
	const [newRoomLabelErrorMessage, setNewRoomLabelErrorMessage] = useState<string>('');

	const navigate = useNavigate();

	const coursesList = Object.entries(account?.courses ?? {})
		.sort(([_idA, courseA],[_idB, courseB]) => courseA.label.localeCompare(courseB.label))
		.map(
			([id, course]) => {
				return  <li className="entry" key={id} onClick={()=>{navigate(`course/${id}`)}}>
							<CourseEntry 
								course={course} 
								deleteFunction={()=>{deleteCourse(id);}} ></CourseEntry>
						</li>
			}
		)

	const roomsList = Object.entries(account?.rooms ?? {})
		.sort(([_idA, roomA],[_idB, roomB]) => roomA.label.localeCompare(roomB.label))
		.map(
			([id, room]) => {
				return  <li className="entry" key={id} onClick={()=>{navigate(`room/${id}`)}}>
							<RoomEntry 
								room={room} 
								deleteFunction={()=>{deleteRoom(id);}} ></RoomEntry>
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
		const courses = {...(account.courses ?? {}),...newCourses};

		const newAccount:Account = {...account, courses: courses};

		SetAccount(newAccount);

	}

	function deleteRoom(roomId:string){
		if(!account){
			console.warn("No context");
			return;
		}

		const rooms = {...(account.rooms)};
		delete rooms[roomId];
		const newAccount:Account = {...account, rooms: rooms};

		SetAccount(newAccount);
	}

	function newRoom(){
		if(!account){
			console.warn("No context");
			return;
		}

		account.rooms ??= {};

		const newLabel = newRoomLabel;
		const newId = md5(newLabel+(Date.now()).toString());

		if(account.rooms[newId]){
			setNewRoomLabelErrorMessage("Eine Klasse mit dieser ID existiert bereits");
			return;
		}

		const newRoom = new Room();
		newRoom.label = newLabel;

		const newRooms:{[key:string]:Room} = {};
		newRooms[newId] = newRoom;
		const rooms = {...(account.rooms ?? {}),...newRooms};

		const newAccount:Account = {...account, rooms: rooms};

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
			<h2>Räume</h2>
			<ul id="roomsList" className="List">
				{roomsList}
			</ul>
			Neuer Raum:
			<input type="text" id="newRoomName" defaultValue={""} placeholder="Raumnummer" onChange={(e)=>{setNewRoomLabel(e.target.value); setNewClassLabelErrorMessage("")}}></input>
			<button onClick={newRoom}>erstellen</button>
			{
				newRoomLabelErrorMessage && (
					<div className="error">{newRoomLabelErrorMessage}</div>
				)
			}
			
		</div>
	);
}