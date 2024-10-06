import './OptionBar.css';

export default function OptionBar(
    {
        studentMode,
        setStudentMode,
    }:{
        studentMode: string,
        setStudentMode: (studentMode: string)=>any,
    }
){
    const buttons = ['+','++','-','--'].map(mode=>{
        const modeString = mode.replaceAll('+','p').replaceAll('-','m');

        const isSelected = studentMode == mode;

        return(
            
            <button 
                id={'studentMode_'+modeString}
                key={'studentMode_'+modeString}
                onClick={()=>setStudentMode(mode)}
                className={isSelected ? 'selected' : ''}
            >
                {mode}
            </button>
        );
    });

    return (
        <div className="OptionBar">
            {buttons}
        </div>
    );
}