import React, { useState } from 'react';
import './App.css';
import Classroom from './Classroom';
import Course from './Course';
import MenuBar from './MenuBar';
import OptionBar from './OptionBar';

function App() {
  const [editMode, setEditMode] = useState<boolean>(true);
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
    <div className="App">
      <MenuBar editMode={editMode} setEditMode={setEditMode} load={load} save={save}></MenuBar>
      <OptionBar studentMode={studentMode} setStudentMode={setStudentMode}></OptionBar>
      <Classroom course={course} editMode={editMode} ></Classroom>
    </div>
  );
}

export default App;
