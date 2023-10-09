import { prisma } from "~/lib/db"
import path from "path"
import {
    resultError,
    makePath,
    loadFile,
    convertUUIDStringToBuffered,
} from "~/lib/util"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

export default async function PhotosOfType(req, res) {

    if (req.method === "GET") {

        const { id, type } = req.query

        const galleryAPIService = GalleryAPIServiceFactory.getClientInstance(process.env.API_SERVER)
        const { photosPath, photosThumbnailsPath } = galleryAPIService.PATHS

        const photosPathAbs = makePath(photosPath, process.env.DATA_DIR)
        const photosThumbnailsPathAbs = makePath(photosThumbnailsPath, process.env.DATA_DIR)

        let photo = null

        try {
            photo = await prisma.Photo.findUnique({
                where: { id: convertUUIDStringToBuffered(id) }
            })
            
            if (!photo) {
                return res.status(404).json(resultError("Photo not found"))
            }
        } catch (e) {
            await prisma.$disconnect()
            console.log(e)
            return res.status(500).json(resultError())
        }

        let filePath, fileName = ""

        if (type === "original") {
            filePath = path.join(photosPathAbs, photo.originalUUID)
            fileName = photo.originalFileName
        } else if (type === "thumbnail") {
            filePath = path.join(photosThumbnailsPathAbs, photo.thumbnailUUID)
            fileName = photo.thumbnailFileName
        } else {
            filePath = ""
        }

        const file = loadFile(filePath)

        res.writeHead(
            200,
            {
                "Content-Type": file.contentType,
                "Content-Disposition": (!file.notFound)
                    ? `attachment; filename=${fileName}`
                    : `attachment; filename=${file.notFound}`
            })
        res.write(file.data)
        return res.end()

    }

}