import { useEffect, useState } from "react"
import { ImageListItem, Box, IconButton, Avatar, Button } from "@mui/material"
import MoreIcon from "@mui/icons-material/MoreVert"
import CRUDMenu from "../../menu/crud-menu"

export default function PhotoElement({
        galleryAPIService,
        image,
        handleOpenCreatePhotoDialog,
        handleOpenEditPhotoDialog,
        handleOpenDeletePhotoDialog,
        toolbar=true
    }) {

    const [isHovering, setIsHovering] = useState(false)
    const [menuParent, setMenuParent] = useState(null)
    const [imgURL, setImgURL] = useState(null)

    useEffect(() => {
        if (image.id != null)
            galleryAPIService.getPhotoThumbnail(image.id).then(url => {
                setImgURL(url)
            }).catch(() => {
                setImgURL(null)
            })
    }, [])

    const handleMouseEnter = () => {
        setIsHovering(true)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
    }

    const handleMenuOpen = (event) => {
        setMenuParent(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuParent(null)
    }

    const handleCreatePhoto = () => {
        handleMenuClose()
        if (menuParent != null) {
            handleOpenCreatePhotoDialog(menuParent.dataset.order)
        } else {
            handleOpenCreatePhotoDialog(null)
        }
    }

    const handleEditPhoto = () => {
        handleMenuClose()
        if (menuParent != null) {
            handleOpenEditPhotoDialog(menuParent.dataset.id, menuParent.dataset.linkid)
        } else {
            handleOpenEditPhotoDialog(null)
        }
    }

    const handleDeletePhoto = () => {
        handleMenuClose()
        if (menuParent != null) {
            handleOpenDeletePhotoDialog(menuParent.dataset.linkid)
        } else {
            handleOpenDeletePhotoDialog(null)
        }
    }

    return (
        <ImageListItem
            sx={{
                border: "2px solid",
                borderColor: isHovering ? "info.main" : "#fff",
                position: "relative",
                cursor: "pointer"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {
                toolbar
                    ? <PhotoElementActions
                            image={image}
                            handleMenuOpen={handleMenuOpen}
                            handleCreatePhoto={handleCreatePhoto}
                        />
                    : null
            }
            <img
                src={imgURL}
                srcSet={imgURL}
                loading="lazy"
            />
            <CRUDMenu
                menuParent={menuParent}
                handleMenuClose={handleMenuClose}
                handleOpenCreateDialog={handleCreatePhoto}
                handleOpenEditDialog={handleEditPhoto}
                handleOpenDeleteDialog={handleDeletePhoto}
            />
        </ImageListItem>
      )

}

function PhotoElementActions({image, handleMenuOpen, handleCreatePhoto}){

    if (image.id != null) {
        return (
            <Box
                sx={{
                    display: "flex",
                    position: "absolute",
                    width: "100%",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    opacity: 0.8
                }}>
                <Avatar sx={{bgcolor: "warning.light"}}>{image.order}</Avatar>
                <Box>
                    <IconButton
                            color="warning"
                            data-order={image.order}
                            data-id={image.id}
                            data-linkid={image.linkId}
                            onClick={handleMenuOpen}>
                        <MoreIcon />
                    </IconButton>
                </Box>
            </Box>
        )
    } else {
        return (
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%"
                }}>
                <Button
                    sx={{width: "100%", height: "100%"}}
                    variant="outlined"
                    onClick={handleCreatePhoto}
                >
                    Load image
                </Button>
            </Box>
        )
    }

}


