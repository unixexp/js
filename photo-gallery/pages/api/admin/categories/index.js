import { prisma } from "~/lib/db"
import {
    convertUUIDBufferedToString,
    makeUUIDBuffered,
    resultOK,
    resultError
} from "~/lib/util"


export default async function getCategories(req, res) {

    if (req.method === "GET") {

        let result = null

        try {
            result = await prisma.Category.findMany()
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        const data = result.map((entry) => {
            if (entry.createdAt != null)
                entry.createdAt = entry.createdAt.toISOString()

            if (entry.updatedAt != null)    
                entry.updatedAt = entry.updatedAt.toISOString()

            entry.id = convertUUIDBufferedToString(entry.id)

            return entry
        })

        res.status(200).json(resultOK(data))

    }

}
