import Student from "./Student";

export default class Course{
    students: Student[] = [];

    constructor(){
        this.students = [
            new Student()
        ];
    }

    set(updateCourse: Course){
        this.students = updateCourse.students;    
    }
}