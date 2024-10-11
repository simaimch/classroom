import { useState } from "react";
import Student from "../_types/Student";
import Lesson from "../_types/Lesson";

export default function LessonEntry(
    {
        children,
        lesson,
        deleteFunction,
    }
    :
    {
        children: any,
        lesson:Lesson,
        deleteFunction: ()=>any,
    }
){
    const [deleteStep, setDeleteStep] = useState<number>(0);

    return(
        <>
            <span className="label">{children}</span>
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