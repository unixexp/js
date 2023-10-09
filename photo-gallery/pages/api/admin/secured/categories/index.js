import { prisma } from "~/lib/db"
import {
    convertUUIDBufferedToString,
    makeUUIDBuffered,
    resultOK,
    resultError
} from "~/lib/util"


export default async function Categories(req, res) {

    if (req.method === "POST") {

        const category = {
            data: {
                id: makeUUIDBuffered(),
                name: req.body.name
            }
        }
        let result = null

        try {
            result = await prisma.Category.create(category)
        } catch (e) {
            console.log(e)
            if (e.code === "P2002") {
                res.status(409).json(resultError("Category already exists"))
            } else {
                res.status(500).json(resultError("Error create category"))
            }
            return
        }

        const data = { ...result }
        data.id = convertUUIDBufferedToString(data.id)

        res.status(201).json(resultOK(data))

    }

}
