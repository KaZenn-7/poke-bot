export function toCapitalize(ogString){
    let string = ogString.toLowerCase();
    let list = string.split(" ")
    string = "";
    for(let str of list){

        let captalized = str[0].toUpperCase();
        for (let i=1; i<str.length; i++){
            captalized += str[i]
        }
        string += " "+captalized
    }
    
    return string
}