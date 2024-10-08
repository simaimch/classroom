import Student from "../_types/Student";

export default function StudentWidget(
    {student}
    :
    {student:Student}
){
    const sitzplatzX = student.sitzplatz[0] || 1;
    const sitzplatzY = student.sitzplatz[1] || 1;

    const style:React.CSSProperties = {
        gridColumn: sitzplatzX,
        gridRow: sitzplatzY,
        color: 'red'
    }

    return (
        <div className="student" style={style}>
            <span className="studentName">{student.name}</span>
        </div>
    );
}