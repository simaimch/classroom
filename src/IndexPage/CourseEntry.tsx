import { useState } from "react";
import Course from "../_types/Course";

export default function CourseEntry(
	{
		course,
		deleteFunction,
		selectFunction,
	}
	:
	{
		course: Course,
		deleteFunction: ()=>any,
		selectFunction: ()=>any,
	}
){

	const [deleteStep, setDeleteStep] = useState<number>(0);

	return (
		<div onClick={(e)=>{selectFunction()}}>
			<span className="courseLabel">{course.label}</span>
			{
				deleteStep == 0
				&&
				<button onClick={(e)=>{
					setDeleteStep(1);
					e.stopPropagation();
				}}>Löschen</button>
			}

			{
				deleteStep == 1
				&&
				<button onClick={(e)=>{
					deleteFunction();
					e.stopPropagation();
				}}>Löschen bestätigen</button>
			}
			
		</div>
	);
}