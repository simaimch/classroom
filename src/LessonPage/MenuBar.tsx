import './MenuBar.css';

export default function MenuBar(
    {
        editMode,
        setEditMode,
        saveLayout,
    }:{
        editMode: boolean,
        setEditMode: (editMode:boolean)=>any,
        saveLayout: ()=>any,
    }){

    const editButton = editMode ? 
        <button onClick={()=>setEditMode(false)}>Disable Edit</button> : 
        <button onClick={()=>setEditMode(true)}>Enable Edit</button>;

    return(
        <div className="MenuBar">
            {editButton}
            <button onClick={saveLayout}>Sitzplan speichern</button>
        </div>
    );
}