import { strictEnvs } from "../../config/envConfig.js";
import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient({
    accelerateUrl: strictEnvs.POSTGRES_DB_URL,
    log: [ "error", "query"],
    errorFormat: "pretty"
});

export { prisma};




