import { useState } from "react";
import Student from "../_types/Student";

export default function StudentEntry(
    {
        student,
        deleteFunction,
    }
    :
    {
        student:Student,
        deleteFunction: ()=>any,
    }
){
    const [deleteStep, setDeleteStep] = useState<number>(0);

    return (
        <div>
            <span className="label">{student.name}</span>
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
        </div>
    );
}