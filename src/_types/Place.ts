export enum EPlaceForm{
    RECT = "r"
}
export type Place = {
    form: EPlaceForm,
    height: number,
    width: number,
    x: number,
    y: number, 
}