import React from "react"
import { useState, useEffect } from "react"
import withAPI from "../hoc/with-api"
import styles from "./photo-preview.module.scss"

const PhotoPreview = ({ data, id, setPhotoPreviewIsOpened, galleryAPIService }) => {

    const [image, setImage] = useState(null)

    useEffect(() => {
        fetchData(id)
    }, [])

    async function fetchData(_id) {
        try {
            const response = await galleryAPIService.getPhoto(_id)
            const element = (data.filter(el => el.id === _id))[0]
            setImage({...element, url: response})
        } catch(e) {
            console.log(e)
            setImage(null)
        }
    }

    const slideLeft = () => {
        const currentIndex = data.findIndex(el => el.id === image.id)
        if (currentIndex > 0)
            fetchData((data[currentIndex - 1]).id)
    }

    const slideRight = () => {
        const currentIndex = data.findIndex(el => el.id === image.id)
        if (currentIndex < data.length - 1)
            fetchData((data[currentIndex + 1]).id)
    }

    const close = (event) => {
        if (event.target === event.currentTarget)
            setPhotoPreviewIsOpened(false)
    }

    return (
        <div className={styles.PhotoPreview} onClick={close}>
            {
                image &&
                    <Content
                        image={image}
                        setPhotoPreviewIsOpened={setPhotoPreviewIsOpened}
                        slideLeft={slideLeft}
                        slideRight={slideRight}
                        close={close}
                    />
            }
        </div>
    )

}

const Content = ({ image, setPhotoPreviewIsOpened, slideLeft, slideRight, close }) => {

    const [imageClass, setImageClass] = useState(styles.PhotoPreviewItemImageH)

    const onImageLoaded = (event) => {
        const rate = event.currentTarget.width / event.currentTarget.height;

        if (rate < 1)
            setImageClass(styles.PhotoPreviewItemImageV)
        else
            setImageClass(styles.PhotoPreviewItemImageH)
    }

    return (
        <div className={styles.PhotoPreviewContainer} onClick={close}>
            <div className={styles.PhotoPreviewArrow}>
                <svg className={styles.PhotoPreviewArrowImage} viewBox="0 0 32 32" onClick={slideLeft}>
                    <use xlinkHref={`icons.svg#ArrowLeft`}></use>
                </svg>
            </div>
            <div className={styles.PhotoPreviewItem}>
                <div className={styles.PhotoPreviewItemHeader}>{image.name}</div>
                <div className={styles.PhotoPreviewItemImageContainer}>
                <div className={imageClass}>
                    <img
                        src={image.url}
                        onClick={setPhotoPreviewIsOpened}
                        onLoad={onImageLoaded}
                    />
                </div>
                </div>
                <div className={styles.PhotoPreviewItemDescription}>{image.description}</div>
            </div>
            <div className={styles.PhotoPreviewArrow}>
                <svg className={styles.PhotoPreviewArrowImage} viewBox="0 0 32 32" onClick={slideRight}>
                    <use xlinkHref={`icons.svg#ArrowRight`}></use>
                </svg>
            </div>
        </div>
    )

}

export default withAPI(PhotoPreview)