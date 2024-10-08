import Course from "./_types/Course";

export default class Account{
    
    courses: {[courseId:string]:Course} = {};

}