import Student from "./Student";

export default class StudentLesson extends Student{
    ratings: {[key:string]:number} = {};
}