export default function parseName(name: string, mode: string){

    function fullName(name: string){return name;}
    function nickName(name:string){
        const regexes = [/.*\(([^)]+)\)/, /.*,\s*(\S+).*/];
        for(const regex of regexes){
            const match = name.match(regex);
            if(match){
                return (match?.[1]) ?? "Name Error";
            }
        }
        return fullName(name);
    }

    name = name.trim();

    switch (mode) {
        case "nick":    return nickName(name);
        default:        return fullName(name);
    }


}