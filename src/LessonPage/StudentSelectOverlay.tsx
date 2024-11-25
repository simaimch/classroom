export default function StudentSelectOverlay(
	{
		selectFunction,
	}
	:
	{
		selectFunction:()=>any,
	}
){
	return(
		<div className="selectOverlay" onClick={selectFunction}>
			
		</div>
	);
}