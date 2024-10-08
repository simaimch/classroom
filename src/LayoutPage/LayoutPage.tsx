import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AccountContext } from "../_contexts/AccountContext";

export default function LayoutPage(){

    let {courseId} = useParams();
	const account = useContext(AccountContext);

	const courseToDisplay = account?.courses[courseId ?? ""];

    return(
        <div className="page">
            <h1>{courseToDisplay?.label} Sitzplan</h1>
        </div>
    );
}