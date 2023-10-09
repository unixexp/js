import { PrismaClient } from "@prisma/client"

export const prisma = global.prisma || new PrismaClient({
    datasources: {
        db: {
            url: "file:../photo-gallery.db"
        }
    },
    log: []
    // log: ["query"]
})
global.prisma = prisma
