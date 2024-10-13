import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, ChartData, ChartDataset, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

export default function StudentPage(){
    let {courseId, studentId} = useParams();
	const account = useContext(AccountContext);

    if(!account)
        return (<>Account connection failed</>);
    if(!courseId)
        return (<>Course Id Error</>);
    if(!studentId)
        return (<>Student Id Error</>);

    const course = account.courses[courseId];
    const student = course.students[studentId];

    const studentLessons = Object.fromEntries(
        Object.entries(course.lessons).map(([lessonId,lesson])=>{
            return [lessonId,
                {
                    lesson: lesson,
                    ratings: lesson.students[studentId ?? ""].ratings
                }
            ]
        })
    );

    const dataSets:ChartDataset<"line",number[]>[] = Object.entries(account.ratingTypes).map(([ratingTypeId,ratingType])=>{
        return {
            label: ratingType.label,
            data: Object.entries(studentLessons).map(([lessonId,lessonData])=>lessonData.ratings[ratingTypeId] ?? 0),
            fill: false,
            tension: 0.1,
            borderColor: 'rgb(75, 192, 192)',
        };
    });
    
    const data:ChartData<"line",number[],string> = {
        labels: Object.entries(studentLessons).map(([lessonId,lessonData])=>lessonId),
        datasets: dataSets,
    }


    return(
        <div className="page">
            <h1>{student.name} ({course.label})</h1>
            <div style={{width:"60vw"}}>
                <Line data={data}></Line>
            </div>
        </div>
    );
}