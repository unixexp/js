import AdminGalleryAPIService from "./admin-gallery-api-service"
import ClientGalleryAPIService from "./client-gallery-api-service"

export const GalleryAPIServiceFactory = (function () {

    return {
        getAdminInstance: function(apiServer) {
            return new AdminGalleryAPIService(apiServer)
        },
        getClientInstance: function(apiServer) {
            return new ClientGalleryAPIService(apiServer)
        }
    }

})()