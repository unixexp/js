import path from "path"
import fs from "fs"
import { prisma } from "~/lib/db"
import {
    convertUUIDStringToBuffered,
    convertUUIDBufferedToString,
    resultOK,
    resultError,
    formatString
} from "~/lib/util"

export default async function Categories(req, res) {

    if (req.method === "GET") {

        const { id } = req.query
        let result = null

        try {
            result = await prisma.Category.findUnique({ where: { id: convertUUIDStringToBuffered(id) } })
            if (!result) {
                res.status(404).json(resultError("Category not found"))
            }
        } catch (e) {
            await prisma.$disconnect()
            console.log(e)
            return res.status(500).json(resultError())
        }

        const data = { ...result }
        data.id = convertUUIDBufferedToString(data.id)

        return res.status(200).json(resultOK(data))

    }

}