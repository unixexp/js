import React, { useEffect, useState } from "react"
import withAPI from "../hoc/with-api"
import styles from "./photos.module.scss"
import PhotoItem from "../photo-item/photo-item"
import PhotoPreview from "../photo-preview/photo-preview"

const Photos = ({ photos, galleryAPIService }) => {

    const [photosWithURL, setPhotosWithURL] = useState([])
    const [photoPreviewIsOpened, setPhotoPreviewIsOpened] = useState(false)
    const [previewPhotoId, setPreviewPhotoId] = useState(null)

    useEffect(() => {
        async function fetchData() {
            const data = []
            for (let i in photos) {
                const photo = photos[i]
                try {
                    const response = await galleryAPIService.getPhotoThumbnail(photo.id)
                    photo.url = response
                    data.push(photo)
                } catch(e) {
                    console.log(e)
                    data.push(null)
                }
            }

            setPhotosWithURL(data)
        }
        
        fetchData()
    }, [photos])

    const previewPhoto = (event) => {
        setPreviewPhotoId(event.currentTarget.dataset.id)
        setPhotoPreviewIsOpened(true)
    }

    return (
        <div className={`${styles.PhotosContainer}`}>
            <div className={`${styles.Photos}`}>
            {
                photosWithURL.map((item) => (
                    <PhotoItem
                        key={`${item.linkId}_${item.linkUpdatedAt}_${item.photoUpdatedAt}`}
                        image={item}
                        previewPhoto={previewPhoto}
                        />
                ))
            }
            </div>
            { 
                photoPreviewIsOpened
                && <PhotoPreview
                        id={previewPhotoId}
                        data={photos}
                        setPhotoPreviewIsOpened={setPhotoPreviewIsOpened}
                    />}
        </div>
    )

}

export default withAPI(Photos)