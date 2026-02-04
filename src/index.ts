import {setUser, readConfig} from "./config";

function main() {
    setUser("Jack");
    const configFile = readConfig();
    if (configFile) console.log(configFile);    
    else console.log("cannot read file");
}

main();