import React from 'react';
import { Routes, Route, HashRouter } from "react-router-dom";

import './App.css';
import IndexPage from './IndexPage/IndexPage';
import { AccountContext } from './_contexts/AccountContext';
import Account from './_types/Account';
import useLocalStorage from './_helpers/useLocalStorage';
import CoursePage from './CoursePage/CoursePage';
import LayoutPage from './LayoutPage/LayoutPage';
import LessonPage from './LessonPage/LessonPage';
import StudentPage from './StudentPage/StudentPage';
import WelcomePage from './WelcomePage/WelcomePage';
import updateObject from './_helpers/updateObject';
import AboutPage from './About/AboutPage';

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


    function acknowledge(){
        if(!account) return;
        SetAccount(updateObject(account,{initialized:true}));
    }

	return (
		(
			!account.initialized ? 
				<WelcomePage start={acknowledge}></WelcomePage>
			:
		<AccountContext.Provider value={account}>
			<HashRouter>
				<Routes>
					<Route path="/">
						<Route index element={<IndexPage></IndexPage>} />
						<Route path="about" element={<AboutPage></AboutPage>}></Route>
						<Route path="course">
							<Route path=":courseId">
								<Route index element={<CoursePage></CoursePage>}></Route>
								<Route path="layout" element={<LayoutPage></LayoutPage>}></Route>
								<Route path="lesson">
									<Route path=":lessonId" element={<LessonPage></LessonPage>}></Route>
								</Route>
								<Route path="student">
									<Route path=":studentId" element={<StudentPage></StudentPage>}></Route>
								</Route>
							</Route>
						</Route>	
					</Route>
				</Routes>
			</HashRouter>
		</AccountContext.Provider>
		)
	);

}

export default App;
