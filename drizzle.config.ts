import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const config = readConfig();
const postgresURL = config ? config.dbUrl : "";

export default defineConfig({
    schema: "src/lib/db/schema.ts",
    out: "src/lib/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: postgresURL,
    },
});