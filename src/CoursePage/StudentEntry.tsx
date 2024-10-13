import { useState } from "react";
import Student from "../_types/Student";

export default function StudentEntry(
    {
        student,
        deleteFunction,
        selectFunction,
    }
    :
    {
        student:Student,
        deleteFunction: ()=>any,
        selectFunction: ()=>any,
    }
){
    const [deleteStep, setDeleteStep] = useState<number>(0);

    return (
        <div onClick={(e)=>{selectFunction()}}>
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