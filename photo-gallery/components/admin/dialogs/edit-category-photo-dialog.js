import { useState, useEffect } from "react"

import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography
} from "@mui/material"

import { useSelector } from "react-redux"
import { selectGuest } from "~/components/app/appSlice"

import UploadableCard from "../main-bar/uploadable-card"

export default function EditCategoryPhotoDialog({
        isOpened,
        handleOK,
        handleClose,
        category,
        photoId,
        galleryAPIService
    }) {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [order, setOrder] = useState(0)
    const [originalUploadable, setOriginalUploadable] = useState(null)
    const [thumbnaillUploadable, setThumbnailUploadable] = useState(null)
    const [originalUploadableChanged, setOriginalUploadableChanged] = useState(false)
    const [thumbnaillUploadableChanged, setThumbnaillUploadableChanged] = useState(false)
    const guest = useSelector(selectGuest)

    useEffect(() => {
        if (photoId != null)
            load()
    }, [])

    const load = async () => {
        galleryAPIService.findCategoryPhotoById(category.id, photoId).then(({response}) => {
            setName(response.name)
            setDescription(response.description)
            setOrder(response.order)

            galleryAPIService.getPhoto(photoId).then((photo) => {
                setOriginalUploadable(photo)

                galleryAPIService.getPhotoThumbnail(photoId).then((thumbnail) => {
                    setThumbnailUploadable(thumbnail)
                }).catch(() => {
                    alert("Error load thumbnail.")
                    onClose()
                })
            }).catch(() => {
                alert("Error load main photo.")
                onClose()
            })
        }).catch(() => {
            alert("Error load photo data.")
            onClose()
        })
    }

    const getUploadableURL = (uploadable) => {
        if (uploadable != null && typeof(uploadable) != 'string')
            return URL.createObjectURL(uploadable)
        else
            return uploadable
    }

    const setOriginalUploadableHandler = (uploadableObject) => {
        setOriginalUploadable(uploadableObject)
        setOriginalUploadableChanged(true)
    }

    const setThumbnailUploadableHandler = (uploadableObject) => {
        setThumbnailUploadable(uploadableObject)
        setThumbnaillUploadableChanged(true)
    }

    const handleOnChangeName = (e) => {
        setName(e.target.value)
    }

    const handleOnChangeOrder = (e) => {
        setOrder(e.target.value)
    }

    const handleOnChangeDescription = (e) => {
        setDescription(e.target.value)
    }

    const onOk = async () => {
        if (!name.length && !description.length
                && originalUploadable == null && thumbnaillUploadable == null) {
            onClose()
        } else {
            try {
                await handleOK({
                    name,
                    description,
                    order,
                    originalUploadable,
                    thumbnaillUploadable,
                    originalUploadableChanged,
                    thumbnaillUploadableChanged
                })
                onClose()
            } catch(e) {
                alert(e)
            }
        }
    }

    const onClose = () => {
        handleClose()
        clean()
    }

    const clean = () => {
        setName("")
        setDescription("")
        setOriginalUploadable(null)
        setThumbnailUploadable(null)
        setOriginalUploadableChanged(false)
        setThumbnaillUploadableChanged(false)
    }

    return (
        <div>
            <Dialog
                open={isOpened}
                onClose={handleClose}
            >
                <DialogContent >
                    <Typography>Original</Typography>
                    <UploadableCard
                        caption="Upload original image"
                        currentImage={getUploadableURL(originalUploadable)}
                        setUploadableHandler={setOriginalUploadableHandler}
                        size="150"/>
                    <Typography>Thumbnail</Typography>
                    <UploadableCard
                        caption="Upload thumbnail"
                        currentImage={getUploadableURL(thumbnaillUploadable)}
                        setUploadableHandler={setThumbnailUploadableHandler}
                        size="150"/>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={handleOnChangeName}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Order"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={order}
                        onChange={handleOnChangeOrder}
                    />
                    <TextField
                        minRows={4}
                        maxRows={4}
                        variant="outlined"
                        multiline
                        label="Description"
                        value={description}
                        fullWidth
                        onChange={handleOnChangeDescription}
                    />
                    <DialogActions>
                        <Button disabled={guest} onClick={onOk}>Ok</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}

