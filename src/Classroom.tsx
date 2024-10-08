import './Classroom.css';
import Course from './_types/Course';
import Student from './_types/Student';
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
    /*const studentList = course.students.map(student=>{
      return(
        <StudentView key={student.id} student={student} editMode={editMode}></StudentView>
      );
    });*/
    const studentList = <></>;

    return (
      <div className="Classroom">
        {studentList}
      </div>
    );
  }
  
  export default Classroom;