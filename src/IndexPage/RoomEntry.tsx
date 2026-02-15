import { useState } from "react";
import Room from "../_types/Room";

export default function RoomEntry(
    {
        room,
        deleteFunction,
    }
    :
    {
        room: Room,
        deleteFunction: ()=>any,
    }
){

    const [deleteStep, setDeleteStep] = useState<number>(0);

    return (
        <div>
            <span className="label">{room.label}</span>
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