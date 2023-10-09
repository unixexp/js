import { prisma } from "~/lib/db"
import {
    resultOK,
    resultError,
    convertUUIDStringToBuffered,
    convertUUIDBufferedToString,
} from "~/lib/util"

export default async function CategoriesPhotos(req, res) {

    if (req.method === "GET") {

        const { id } = req.query
        let result = []

        try {
            result = await prisma.CategoryPhotoLink.findMany({
                where: { categoryId: convertUUIDStringToBuffered(id) },
                include: { Photo: true },
                orderBy: { order: "asc" }
            })
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        const data = result.map((link) => {
            const photo = link.Photo

            return {
                id: convertUUIDBufferedToString(photo.id),
                linkId: convertUUIDBufferedToString(link.id),
                linkUpdatedAt: link.updatedAt != null ? new Date(link.updatedAt) : link.updatedAt,
                photoUpdatedAt: photo.updatedAt != null ? new Date(photo.updatedAt) : photo.updatedAt,
                name: photo.name,
                description: photo.description,
                order: link.order
            }
        })

        return res.status(200).json(resultOK(data))

    }

}

