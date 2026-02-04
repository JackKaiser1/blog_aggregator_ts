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
        dbUrl: "postgres://example",
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

export function readConfig(): Config | undefined {
    const filePath = getConfigFilePath();
    const configFile = fs.readFileSync(filePath, {encoding: "utf-8"});
    const rawConfig = JSON.parse(configFile);
    const validConfig = validateConfig(rawConfig);
    if (validConfig) return validConfig;

    return undefined;
}

function validateConfig(rawConfig: any): Config | undefined {
    if (rawConfig.db_url && rawConfig.curent_user_name) {
        return {
            dbUrl: rawConfig.db_url,
            currentUserName: rawConfig.curent_user_name
        }
    }
    return undefined;
}

