import React, { createElement, useEffect } from "react"
import withAPI from "../hoc/with-api"
import styles from "./photo-item.module.scss"

const PhotoItem = ({ image, previewPhoto }) => {

    return (
        <div className={`${styles.PhotoItem}`}>
            <div className={`${styles.PhotoItemText}`}>{image.name}</div>
            <div className={`${styles.PhotoItemImage}`}>
                <img
                    data-id={image.id}
                    src={image.url}
                    onClick={previewPhoto}
                />
            </div>
        </div>
    )

}

export default withAPI(PhotoItem)