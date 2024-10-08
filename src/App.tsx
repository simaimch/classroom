import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import './App.css';
import Classroom from './Classroom';
import Course from './_types/Course';
import MenuBar from './LessonPage/MenuBar';
import OptionBar from './OptionBar';
import IndexPage from './IndexPage/IndexPage';
import { AccountContext } from './_contexts/AccountContext';
import Account from './Account';
import useLocalStorage from './_helpers/useLocalStorage';
import CoursePage from './CoursePage/CoursePage';
import LayoutPage from './LayoutPage/LayoutPage';
import LessonPage from './LessonPage/LessonPage';

//#region Account
	const emptyAccount = new Account();
	let [account, setAccount]:[Account, React.Dispatch<React.SetStateAction<Account>>] = [emptyAccount,(()=>{})];
	export function GetAccount():Account{return account;}
	export function SetAccount(account:Account){
		setAccount(account);
	};
//#endregion

function App() {

	[account, setAccount] = useLocalStorage<Account>('account',emptyAccount);

	
	const [course, setCourse] = useState(new Course());

	const [studentMode, setStudentMode] = useState<string>('');

	function load(){
	const newCourse = new Course();
		setCourse(newCourse);
	}

	function save(){
	const courseSerialized = JSON.stringify(course);
	console.log(courseSerialized);
	}

	return (
		<AccountContext.Provider value={account}>
			<BrowserRouter>
				<Routes>
					<Route path="/">
						<Route index element={<IndexPage></IndexPage>} />
						<Route path="course">
							<Route path=":courseId">
								<Route index element={<CoursePage></CoursePage>}></Route>
								<Route path="layout" element={<LayoutPage></LayoutPage>}></Route>
								<Route path="lesson">
									<Route path=":lessonId" element={<LessonPage></LessonPage>}></Route>
								</Route>
							</Route>
						</Route>	
					</Route>
				</Routes>
			</BrowserRouter>
		</AccountContext.Provider>
	);

}

export default App;
