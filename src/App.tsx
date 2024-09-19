import React, { useState } from 'react';
import './App.css';
import Classroom from './Classroom';
import Course from './Course';
import MenuBar from './MenuBar';

function App() {
  const [editMode, setEditMode] = useState<boolean>(true);
  const [course, setCourse] = useState(new Course());

  return (
    <div className="App">
      <MenuBar editMode={editMode} setEditMode={setEditMode}></MenuBar>
      <Classroom course={course} editMode={editMode} ></Classroom>
    </div>
  );
}

export default App;
