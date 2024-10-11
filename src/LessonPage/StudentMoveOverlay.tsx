export default function StudentMoveOverlay(
	{
		moveFunction,
	}
	:
	{
		moveFunction:(deltaX:number,deltaY:number)=>any,
	}
){
	return(
		<div className="moveOverlay">
			<button onClick={(e)=>moveFunction( 0,-1)} className="up">⇑</button>
			<button onClick={(e)=>moveFunction( 0, 1)}  className="down">⇓</button>
			<button onClick={(e)=>moveFunction(-1, 0)}  className="left">⇐</button>
			<button onClick={(e)=>moveFunction( 1, 0)}  className="right">⇒</button>
		</div>
	);
}