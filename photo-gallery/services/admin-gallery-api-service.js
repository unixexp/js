import GalleryAPIService from "./gallery-api-service";
import { formatString } from "~/lib/util"

export default class AdminGalleryAPIService extends GalleryAPIService {

    constructor(apiServer){
        super(apiServer)

        this.API_ROUTES = {
            ...this.API_ROUTES, 
            categories: "/api/admin/categories",
            categoriesPhotos: "/api/admin/categories/<id>/photos",
            categoriesPhotosFindById: "/api/admin/categories/<category_id>/photos/<photo_id>",
            categoriesPhotosThumbnail: "/api/admin/categories/<id>/photos/<id>/thumbnail",
            categoriesPhotosMain: "/api/admin/categories/<id>/photos/main",

            categoriesSecured: "/api/admin/secured/categories",
            categoriesPhotosSecured: "/api/admin/secured/categories/<id>/photos",
            categoriesPhotosMainSecured: "/api/admin/secured/categories/<id>/photos/main",
            categoriesPhotosDeleteSecured: "/api/admin/secured/categories/<category_id>/photos/<link_id>",

            photos: "/api/admin/photos",
            photosOriginal: "/api/admin/photos/<id>/original",
            photosThumbnail: "/api/admin/photos/<id>/thumbnail"
        }
    }

    // Secured features
    removeCategory = async (id) => {
        const path = `${this.getRouteURL("categoriesSecured")}/${id}`
        const response = await this.requestWithAuth(async (authHeaders) => {
            return await fetch(path, {
                method: "DELETE",
                headers: {"Content-Type": "application/json", ...authHeaders}
            })
        }, path)
        return await response.json()
    }

    addCategory = async (name) => {
        const path = this.getRouteURL("categoriesSecured")
        const response = await this.requestWithAuth(async (authHeaders) => {
            return await fetch(path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders
                },
                body: JSON.stringify({name: name})
            })
        }, path)
        return await response.json()
    }

    updateCategory = async (category) => {
        const path = `${this.getRouteURL("categoriesSecured")}/${category.id}`
        const response = await this.requestWithAuth(async (authHeaders) => {
            return await fetch(path, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders
                },
                body: JSON.stringify(category)
            })
        }, path)
        return await response.json()
    }

    uploadCategoryMainPhoto = async (category, uploadable) => {
        const path = formatString(this.getRouteURL("categoriesPhotosMainSecured"), {id: category.id})
        const response = await this.requestWithAuth(async (authHeaders) => {
            const body = new FormData()
            body.append("file", uploadable)
            return await fetch(path, { method: "POST", body: body, headers: authHeaders })
        }, path)
        return await response.json()
    }

    createCategoryPhoto = async (params) => {
        const {
            name,
            description,
            originalUploadable,
            thumbnaillUploadable,
            category,
            order,
            loadedFromExists
        } = params

        const path = formatString(this.getRouteURL("categoriesPhotosSecured"), {id: category.id})
        const response = await this.requestWithAuth(async (authHeaders) => {
            const body = new FormData()
            body.append("name", name)
            body.append("description", description)
            body.append("order", order)
            body.append("originalUploadable", originalUploadable)
            body.append("thumbnailUploadable", thumbnaillUploadable)
            body.append("loadedFromExists", loadedFromExists)
            return await fetch(path, { method: "POST", body: body, headers: authHeaders })
        }, path)
        return await response.json()
    }

    updateCategoryPhoto = async (params) => {
        const {
            photoId,
            linkId,
            name,
            description,
            originalUploadable,
            thumbnaillUploadable,
            category,
            order,
            originalUploadableChanged,
            thumbnaillUploadableChanged
        } = params

        const path = formatString(this.getRouteURL("categoriesPhotosSecured"), {id: category.id})
        const response = await this.requestWithAuth(async (authHeaders) => {
            const body = new FormData()
            body.append("linkId", linkId)
            body.append("name", name)
            body.append("description", description)
            body.append("order", order)

            if (originalUploadableChanged) {
                body.append("originalUploadable", originalUploadable)
            } else {
                body.append("originalUploadable", null)
            }
            
            if (thumbnaillUploadableChanged) {
                body.append("thumbnailUploadable", thumbnaillUploadable)
            } else {
                body.append("thumbnailUploadable", null)
            }
            return await fetch(path, { method: "PUT", body: body, headers: authHeaders })
        }, path)
        return await response.json()
    }

    deleteCategoryPhoto = async (categoryId, linkId) => {
        const path = formatString(
            this.getRouteURL("categoriesPhotosDeleteSecured"),
            { category_id: categoryId, link_id: linkId }
        )
        const response = await this.requestWithAuth(async (authHeaders) => {
            return await fetch(path, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders
                }
            })
        }, path)
        return await response.json()
    }

    // Insecured features
    getCategoryMainPhoto = async (category) => {
        const path = formatString(this.getRouteURL("categoriesPhotosMain"), {id: category.id})
        const response = await this.requestWithAuth(async (authHeaders) => {
            return await fetch(path, { method: "GET", headers: authHeaders })
        }, path)

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
        const response = await this.requestWithAuth(async (authHeaders) => {
            return await fetch(path, { method: "GET", headers: authHeaders })
        }, path)
        return await response.json()
    }

    getCategories = async () => {
        const path = this.getRouteURL("categories")
        const response = await this.requestWithAuth(async (authHeaders) => {
            return await fetch(path, {
                method: "GET",
                headers: {"Content-Type": "application/json", ...authHeaders}
            })
        }, path)
        return await response.json()
    }

    findCategoryPhotoById = async (categoryId, photoId) => {
        const path = formatString(
            this.getRouteURL("categoriesPhotosFindById"),
            { category_id: categoryId, photo_id: photoId }
        )
        const response = await this.requestWithAuth(async (authHeaders) => {
            return await fetch(path, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders
                }
            })
        }, path)
        
        if (response.status == 200) {
            return await response.json()
        } else {
            throw new Error(response.status)
        }
    }

    __getPhoto = async (path) => {
        const response = await this.requestWithAuth(async (authHeaders) => {
            return await fetch(path, { method: "GET", headers: authHeaders })
        }, path)

        if (response.status == 200) {
            const imgBlob = await response.blob()
            return URL.createObjectURL(imgBlob)   
        } else {
            throw new Error(response.status)
        }
    }

    getPhotos = async () => {
        const path = this.getRouteURL("photos")
        const response = await this.requestWithAuth(async (authHeaders) => {
            return await fetch(path, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders
                }
            })
        }, path)
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

}