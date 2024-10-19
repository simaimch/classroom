import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, ChartData, ChartDataset, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import Menu from "./Menu";
import '../_ui/List.css';
import { SetAccount } from "../App";
import updateObject from "../_helpers/updateObject";
import Account from "../_types/Account";
import StudentLabel from "../_ui/StudentLabel";
import arrayToHSL from "../_ui/arrayToHSL";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

export default function StudentPage(){
    let {courseId, studentId} = useParams();
	const account = useContext(AccountContext);
    const [rename,setRename] = useState<string>("");

    if(!account)
        return (<>Account connection failed</>);
    if(!courseId)
        return (<>Course Id Error</>);
    if(!studentId)
        return (<>Student Id Error</>);

    const course = account.courses[courseId];
    const student = course.students[studentId];

    const studentLessons = Object.fromEntries(
        Object.entries(course.lessons)
            .map(([lessonId,lesson])=>{
                const studentLesson = lesson.students[studentId ?? ""] ?? {ratings:{}};
                return [lessonId,
                    {
                        lesson: lesson,
                        ratings: studentLesson.ratings
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
            borderColor: arrayToHSL(ratingType.color),
        };
    });
    
    const data:ChartData<"line",number[],string> = {
        
        datasets: dataSets,
    }

    function renameFunction(newName:string){
        if(!courseId || !studentId || !account)
            return;
        const updateAccount = {courses:{[courseId]:{students:{[studentId]:{name:newName}}}}};
        SetAccount(updateObject<Account>(account,updateAccount));
    }

    return(
        <div className="page">
            <Menu></Menu>
            <h1><StudentLabel student={student}></StudentLabel> ({course.label})</h1>
            <div>
                <input defaultValue={student.name} onChange={(e)=>{setRename(e.target.value)}}></input>
                <button onClick={()=>{renameFunction(rename)}}>Umbenennen</button>
            </div>
            <div style={{width:"60vw"}}>
                <Line data={data} options={{
                    scales:{
                        xAxes:{
                            labels: Object.entries(studentLessons).map(([lessonId,lessonData])=>new Date(lessonData.lesson.timeStart).toLocaleString()),
                            ticks:{
                                autoSkip:false,maxRotation:45,minRotation:45
                            }
                        }
                    }
                }}></Line>
            </div>
        </div>
    );
}