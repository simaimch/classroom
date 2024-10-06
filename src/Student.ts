export default class Student{
    name: string = "Unknown";
    sitzplatz: number[] = [0,0];

    _id = 1;

    get id(){
        return this._id;
    }

    constructor(){
        this.sitzplatz[0] = 4;
        this._id = Math.random();
    }
}