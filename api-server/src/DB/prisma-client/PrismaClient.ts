import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient({
    log: [ "error", "query"],
    errorFormat: "pretty"
});

export { prisma};




