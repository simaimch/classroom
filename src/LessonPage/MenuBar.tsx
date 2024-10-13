import { Link, useParams } from 'react-router-dom';
import '../_ui/MenuBar.css';

export default function MenuBar(
    {
        editMode,
        setEditMode,
        saveLayout,
        undoFunction,
    }:{
        editMode: boolean,
        setEditMode: (editMode:boolean)=>any,
        saveLayout: ()=>any,
        undoFunction: ()=>any,
    }){

    let {courseId, lessonId} = useParams();

    const editButton = editMode ? 
        <button onClick={()=>setEditMode(false)}>Bearbeiten beenden</button> : 
        <button onClick={()=>setEditMode(true)}>Bearbeiten</button>;

    return(
        <div className="MenuBar">
            <Link to={"/"}>Startseite</Link>
            <Link to={`/course/${courseId}`}>Klassenübersicht</Link>
            {editButton}
            <button onClick={saveLayout}>Sitzplan für alle Unterrichte speichern</button>
            <button onClick={undoFunction}>Rückgängig</button>
            
        </div>
    );
}