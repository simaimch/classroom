import { useState } from "react";
import Lesson from "../_types/Lesson";

export default function LessonEntry(
    {
        lesson,
        deleteFunction,
    }
    :
    {
        lesson:Lesson,
        deleteFunction: ()=>any,
    }
){
    const [deleteStep, setDeleteStep] = useState<number>(0);

    return(
        <>
            <span className="label">{new Date(lesson.timeStart).toLocaleString()}</span>
            {
				deleteStep === 0
				&&
				<button onClick={(e)=>{
					setDeleteStep(1);
					e.stopPropagation();
				}}>Löschen</button>
			}

			{
				deleteStep === 1
				&&
				<button onClick={(e)=>{
					deleteFunction();
					e.stopPropagation();
				}}>Löschen bestätigen</button>
			}
        </>
    );
}