import StudentLesson from "./StudentLesson";

export default class Lesson{
    label:string = "";

    students: {[key:string]:StudentLesson} = {};
    
    timeStart: number = 0;
    timeEnd: number= Number.MAX_SAFE_INTEGER;

    editHistory?:{[key:string]: EditHistoryEntry} = {};
}

export type EditHistoryEntry = {
    time: number,
    operations: {[key:string]: EditHistoryOperation};
};

export type EditHistoryOperation = {
    studentId: string;
    previousPosition?: number[];
    previousRatings?: {[ratingId:string]:number};
};