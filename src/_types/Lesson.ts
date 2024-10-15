import StudentLesson from "./StudentLesson";

export default class Lesson{
    label:string = "";

    students: {[key:string]:StudentLesson} = {};
    
    timeStart: number = 0;
    timeEnd: number= Number.MAX_SAFE_INTEGER;
}