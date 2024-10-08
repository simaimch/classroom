import Lesson from "./Lesson";
import Student from "./Student";

export default class Course{

    label: string = "Unbenannt";
    students: {[key:string]:Student} = {};
    lessons: {[key:string]:Lesson} = {};
}