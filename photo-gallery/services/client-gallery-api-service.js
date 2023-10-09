import GalleryAPIService from "./gallery-api-service";
import { formatString } from "~/lib/util"

export default class ClientGalleryAPIService extends GalleryAPIService {

    constructor(apiServer){
        super(apiServer)

        this.API_ROUTES = {
            ...this.API_ROUTES,
            categories: "/api/client/categories",
            categoriesPhotos: "/api/client/categories/<id>/photos",
            categoriesPhotosFindById: "/api/client/categories/<category_id>/photos/<photo_id>",
            categoriesPhotosDelete: "/api/client/categories/<category_id>/photos/<link_id>",
            categoriesPhotosThumbnail: "/api/client/categories/<id>/photos/<id>/thumbnail",
            categoriesPhotosMain: "/api/client/categories/<id>/photos/main",

            photos: "/api/client/photos",
            photosOriginal: "/api/client/photos/<id>/original",
            photosThumbnail: "/api/client/photos/<id>/thumbnail"
        }
    }

    getCategories = async () => {
        const path = this.getRouteURL("categories")
        const response = await fetch(path, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            })
        return await response.json()
    }

    getCategoryMainPhoto = async (category) => {
        const path = formatString(this.getRouteURL("categoriesPhotosMain"), {id: category.id})
        const response = await fetch(path, { method: "GET" })

        if (response.status == 200) {
            const contentType = response.headers.get("Content-Type")
            if (contentType.indexOf("application/json") == -1) {
                const imgBlob = await response.blob()
                return URL.createObjectURL(imgBlob)
            } else {
                throw new Error(response.json())    
            }
        } else {
            throw new Error(response.status)
        }
    }

    getCategoryPhotos = async (category) => {
        const path = formatString(this.getRouteURL("categoriesPhotos"), {id: category.id})
        const response = await fetch(path, { method: "GET" })
        return await response.json()
    }

    findCategoryPhotoById = async (categoryId, photoId) => {
        const path = formatString(
            this.getRouteURL("categoriesPhotosFindById"),
            { category_id: categoryId, photo_id: photoId }
        )
        const response = await fetch(path, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
        
        if (response.status == 200) {
            return await response.json()
        } else {
            throw new Error(response.status)
        }
    }

    __getPhoto = async (path) => {
        const response = await fetch(path, { method: "GET" })

        if (response.status == 200) {
            const imgBlob = await response.blob()
            return URL.createObjectURL(imgBlob)   
        } else {
            throw new Error(response.status)
        }
    }

    getPhotos = async () => {
        const path = this.getRouteURL("photos")
        const response = await fetch(path, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
        return await response.json()
    }

    getPhoto = async (id) => {
        const path = formatString(this.getRouteURL("photosOriginal"), {id})
        return this.__getPhoto(path)
    }

    getPhotoThumbnail = async (id) => {
        const path = formatString(this.getRouteURL("photosThumbnail"), {id})
        return this.__getPhoto(path)
    }

    getRouteURL = (route) => {
        let url
        if (route in this.API_ROUTES)
            url = new URL(this.API_ROUTES[route], this.API_SERVER)
        else
            url = new URL(route, this.API_SERVER)

        return url.href
    }

}