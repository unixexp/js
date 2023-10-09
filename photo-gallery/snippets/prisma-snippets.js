import { parse as uuidParse } from "uuid";
import { PrismaClient } from "@prisma/client";

function initTestData() {

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "file:../photo-gallery.db"
            }
        }
    })

    const categories = [
        {
            id: Buffer.from(uuidParse("755d2eda-77ec-4456-9d0f-f6597ea8dda1")),
            name: "Category 1",
            description: "Category 1 description",
            mainPhoto: "data:image/jpeg;base64,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"
        },
        {
            id: Buffer.from(uuidParse("5d03f72c-489c-4bcc-8b9f-d3e54e1a5e4a")),
            name: "Category 2",
            description: "Category 2 description",
            mainPhoto: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80"
        }
    ]

    let result = null;
    categories.map(async (cat) => {
        try {
            result = await prisma.Category.create({ data: cat })
        } catch (e) {
            console.log("----- Create error -----")
            console.log(e)
        } finally {
            console.log("----- Created -----")
            console.log(result)
        }
    })

    prisma.$disconnect()

}

async function deletePhotosFromDB() {

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "file:../photo-gallery.db"
            }
        }
    })

    try {
        await prisma.Photo.deleteMany({})
    } catch (e) {
        console.log(e)
    }

}

async function deleteRefreshSessions() {

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "file:../photo-gallery.db"
            }
        }
    })

    try {
        await prisma.RefreshSession.deleteMany({})
    } catch (e) {
        console.log(e)
    }

}

async function deleteRefreshSessionByToken(tokenString) {

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "file:../photo-gallery.db"
            }
        }
    })

    let session = null
    try {
        session = await prisma.RefreshSession.findUnique({ where: { refreshToken: tokenString } })
        if (!session) {
            console.log("Session not found")
            return
        }
    } catch (e) {
        console.log(e)
        return
    }

    try {
        await prisma.RefreshSession.delete({ where: { id: session.id } })
    } catch (e) {
        console.log(e)
        console.log(session)
    }

}

// initTestData()
// deletePhotosFromDB()
// deleteRefreshSessions()
// deleteRefreshSessionByToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZjg2YjE4NWQtZTAyNy00NjYwLWFiMmMtMTBiOGIyMmM4MWIwIiwiZXhwIjoxNjc4MTM4MjA0LCJpYXQiOjE2NzU1NDYyMDR9.dGoKKM5ig1seDyNB4LehNUeAfW75GpW0DCdPCnSzmFQ")