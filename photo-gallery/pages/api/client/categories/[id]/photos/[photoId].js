import { prisma } from "~/lib/db"
import {
    resultOK,
    resultError,
    convertUUIDStringToBuffered,
    convertUUIDBufferedToString
} from "~/lib/util"

export default async function CategoriesPhoto(req, res) {

    if (req.method === "GET") {

        const { id: categoryId, photoId } = req.query
        let photo = null
        let data = null

        try {
            photo = await prisma.Photo.findUnique({
                where: {
                    id: convertUUIDStringToBuffered(photoId)
                },
                include: {
                    CategoryPhotoLink: {
                        where: {
                            AND: [
                                { photoId: convertUUIDStringToBuffered(photoId) },
                                { categoryId: convertUUIDStringToBuffered(categoryId) }
                            ]
                        }
                    }
                }
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json(resultError())
        }

        if (photo != null) {
            data = {
                id: convertUUIDBufferedToString(photo.id),
                linkId: photo.CategoryPhotoLink.length
                    ? convertUUIDBufferedToString(photo.CategoryPhotoLink[0].id)
                    : 0,
                name: photo.name,
                description: photo.description,
                order: photo.CategoryPhotoLink.length
                    ? photo.CategoryPhotoLink[0].order
                    : 0
            }
        } else {
            return res.status(404).json(resultError("Not found."))
        }

        return res.status(200).json(resultOK(data))

    }

}