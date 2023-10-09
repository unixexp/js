import APIContext from "./api-context"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

const APIProvider = ({ children, API_SERVER }) => {

    const galleryAPIService = GalleryAPIServiceFactory.getClientInstance(API_SERVER)

    return (
        <APIContext.Provider value={{ galleryAPIService }}>
            {children}
        </APIContext.Provider>
    )

}

export default APIProvider