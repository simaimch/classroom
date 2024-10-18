import { useContext } from "react";
import { AccountContext } from "../_contexts/AccountContext";
import Student from "../_types/Student";
import parseName from "./parseName";

export default function StudentLabel(
    {student}
    :
    {student: Student}
){
    let account = useContext(AccountContext);

    return (
        <span className="studentLabel">
            {parseName(student.name, account?.preferences.studentLabeling ?? "")}
        </span>
    );
}