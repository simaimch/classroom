import { Link, useParams } from 'react-router-dom';
import '../_ui/MenuBar.css';
import MenuBar from '../_ui/MenuBar';
import { EEditMode } from './LessonPage';

export default function LessonMenuBar(
    {
        editMode,
        setEditMode,
        saveLayout,
        undoFunction,
    }:{
        editMode: EEditMode,
        setEditMode: (editMode:EEditMode)=>any,
        saveLayout: ()=>any,
        undoFunction: (()=>any) | null,
    }){

    let {courseId} = useParams();

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
        </MenuBar>
    );
}