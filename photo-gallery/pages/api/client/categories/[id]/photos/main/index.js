import { prisma } from "~/lib/db"
import path from "path"
import {
    resultError,
    formatString,
    loadFile,
    convertUUIDStringToBuffered
} from "~/lib/util"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

export default async function CategoriesPhotosMain(req, res) {

    if (req.method === "GET") {

        const galleryAPIService = GalleryAPIServiceFactory.getClientInstance(process.env.API_SERVER)
        const { mainPhotoPath } = galleryAPIService.PATHS
        const { id } = req.query

        let category = null

        try {
            category = await prisma.Category.findUnique({
                where: { id: convertUUIDStringToBuffered(id) }
            })
            
            if (!category) {
                return res.status(404).json(resultError("Category not found"))
            }
        } catch (e) {
            await prisma.$disconnect()
            console.log(e)
            return res.status(500).json(resultError())
        }

        if (category.mainPhoto != null) {
            const filePath = path.join(
                process.env.DATA_DIR,
                formatString(mainPhotoPath, {id: id}),
                category.mainPhoto)
    
            const file = loadFile(filePath)
    
            res.writeHead(
                200,
                {
                    "Content-Type": file.contentType,
                    "Content-Disposition": (!file.notFound)
                        ? `attachment; filename=${category.mainPhoto}`
                        : `attachment; filename=${file.notFound}`
                })
            res.write(file.data)
            return res.end()
        } else {
            return res.status(200).json(resultError("Image not loaded"))
        }

    }

}