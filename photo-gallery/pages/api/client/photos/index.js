import { prisma } from "~/lib/db"

import {
    resultOK,
    resultError,
    convertUUIDBufferedToString
} from "~/lib/util"

export default async function Photos(req, res) {

    if (req.method === "GET") {

        let result = []

        try {
            result = await prisma.Photo.findMany({ orderBy: { name: "asc" } })
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        const data = result.map((photo) => {
            return {
                id: convertUUIDBufferedToString(photo.id),
                photoUpdatedAt: photo.updatedAt != null ? new Date(photo.updatedAt) : photo.updatedAt,
                name: photo.name,
                description: photo.description
            }
        })
        
        return res.status(200).json(resultOK(data))

    }

}