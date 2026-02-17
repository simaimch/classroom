import { Link, useParams } from 'react-router-dom';
import '../_ui/MenuBar.css';
import MenuBar from '../_ui/MenuBar';
import { EEditMode } from './LessonPage';
import { useContext } from 'react';
import { AccountContext } from '../_contexts/AccountContext';

export default function LessonMenuBar(
    {
        editMode,
        setEditMode,
        saveLayout,
        undoFunction,
        onRoomChange,
    }:{
        editMode: EEditMode,
        setEditMode: (editMode:EEditMode)=>any,
        saveLayout: ()=>any,
        undoFunction: (()=>any) | null,
        onRoomChange: (roomId:string)=>any,
    }){
    let account = useContext(AccountContext);
    let {courseId, lessonId} = useParams();

    const roomId = (account && courseId && lessonId) ? account.courses[courseId].lessons[lessonId].roomId : "";

    const editButton = editMode ? 
        <button onClick={()=>setEditMode(EEditMode.None)}>Bearbeiten beenden</button> : 
        <button onClick={()=>setEditMode(EEditMode.Layout)}>Bearbeiten</button>;

    return(
        <MenuBar>
            <Link to={"/"}>Startseite</Link>
            <Link to={`/course/${courseId}`}>Klassenübersicht</Link>
            {editButton}
            <button onClick={saveLayout}>Sitzplan für alle Unterrichte speichern</button>
            {
                undoFunction && <button onClick={undoFunction}>Rückgängig</button>
            }
            <select id="roomSelector" defaultValue={roomId} onChange={(ev) => onRoomChange(ev.target.value)}>

                {
                    Object.entries(account?.rooms ?? {}).map(([roomId,room])=>
                        <option value={roomId} key={roomId}>{room.label}</option>
                    )
                }

                <option value="">-</option>
            </select>
        </MenuBar>
    );
}