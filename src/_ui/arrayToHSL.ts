export default function arrayToHSL(arr:number[]){
    return `hsl(${arr[0]}, ${arr[1]*100}%, ${arr[2]*100}%)`
}