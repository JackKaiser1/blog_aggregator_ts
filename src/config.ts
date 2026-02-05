import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string;
    currentUserName: string;
}

function getConfigFilePath(): string {
    const homeDir = os.homedir();
    const config = ".gatorconfig.json";
    return path.join(homeDir, config);
}

export function setUser(userName: string) {
    const configObj: Config = {
        dbUrl: "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
        currentUserName: userName,
    }
    writeConfig(configObj);
}

function writeConfig(config: Config): void {
    const filePath = getConfigFilePath();
    const convertedConfig = {
        db_url: config.dbUrl,
        curent_user_name: config.currentUserName,
    }
    const configStr = JSON.stringify(convertedConfig);
    fs.writeFileSync(filePath, configStr, {encoding: "utf-8"});
}

export function readConfig(): Config {
    const filePath = getConfigFilePath();
    const configFile = fs.readFileSync(filePath, {encoding: "utf-8"});
    const rawConfig = JSON.parse(configFile);
    return validateConfig(rawConfig);    
}

function validateConfig(rawConfig: any): Config {
    if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
        throw new Error("db_url is required");
    }
    if (!rawConfig.curent_user_name || typeof rawConfig.curent_user_name !== "string") {
        throw new Error("current_user_name is required");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    }
}

