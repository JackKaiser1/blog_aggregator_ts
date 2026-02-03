import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string;
}

export function setUser() {

}

export function readConfig() {

}

function getConfigFilePath(): string {
    const homePath = os.homedir();
    return path.join(homePath, ".gatorconfig.json");
}

function writeConfig(config: Config): void {
    
}

function validateConfig(rawConfig: any): Config {
    return {dbUrl: "",
            currentUserName: "",
    }
}

console.log(getConfigFilePath());