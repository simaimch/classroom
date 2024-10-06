import './Classroom.css';
import Course from './Course';
import Student from './Student';
import StudentView from './StudentView';

function Classroom(
    {
      course,
      editMode,
    }
    :
    {
      course:Course,
      editMode: boolean,
    }
) {
    const studentList = course.students.map(student=>{
      return(
        <StudentView key={student.id} student={student} editMode={editMode}></StudentView>
      );
    });

    return (
      <div className="Classroom">
        {studentList}
      </div>
    );
  }
  
  export default Classroom;