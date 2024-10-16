import { CurrentVersion } from "../_versioning/updateVersion";
import Course from "./Course";
import RatingType from "./RatingType";

export default class Account{
    
    initialized:boolean = false;

    courses: {[courseId:string]:Course} = {};

    ratingTypes: {[typeId:string]: RatingType} = {
        "++":{label: '++', points: 3,							color: [120, 1, 0.35]},
        "+":{label: '+', points: 1,								color: [120, 1, 0.55]},
        "Unachtsamkeit":{label: 'Unachtsam.', points: -0.5,		color: [  0, 1, 0.35]},
        "Störung":{label: 'Störung', points: -3,				color: [  0, 1, 0.55]},
    };

	version: number = CurrentVersion;

	preferences: {
		studentLabeling: string
	} = {
		studentLabeling: ""
	};
}