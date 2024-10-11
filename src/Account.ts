import Course from "./_types/Course";
import RatingType from "./_types/RatingType";

export default class Account{
    
    courses: {[courseId:string]:Course} = {};

    ratingTypes: {[typeId:string]: RatingType} = {
        "++":{label: '++', points: 3},
        "+":{label: '+', points: 1},
        "Unachtsamkeit":{label: 'Unachtsam.', points: -0.5},
        "Störung":{label: 'Störung', points: -3},
    };
}