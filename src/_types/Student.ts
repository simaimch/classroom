export default class Student{
    id:string = "";
    name: string = "Unknown";
    /**
     * @deprecated
     */
    sitzplatz: number[] = [1,1];

    placeIdByRoom: Record<string,string> = {};
}