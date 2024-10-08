import './MenuBar.css';

export default function MenuBar(
    {
        editMode,
        setEditMode,
        load,
        save,
    }:{
        editMode: boolean,
        setEditMode: (editMode:boolean)=>any,
        load: ()=>any,
        save: ()=>any,
    }){

    const editButton = editMode ? 
        <button onClick={()=>setEditMode(false)}>Disable Edit</button> : 
        <button onClick={()=>setEditMode(true)}>Enable Edit</button>;

    return(
        <div className="MenuBar">
            {editButton}
        </div>
    );
}