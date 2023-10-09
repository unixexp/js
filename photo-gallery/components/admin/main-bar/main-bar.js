import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import AppBar from "@mui/material/AppBar"
import TextField from "@mui/material/TextField"
import MoreIcon from "@mui/icons-material/MoreVert"
import AccountCircle from '@mui/icons-material/AccountCircle';
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Menu from '@mui/material/Menu'

import AlertDialog from "../dialogs/alert-dialog"
import InputDialog from "../dialogs/input-dialog"
import LoadMainImageDialog from "../dialogs/load-main-image-dialog"

import { selectCategory, setCategory, selectUser, setIsAuthorized, selectGuest } from "../../app/appSlice"
import CRUDMenu from "../menu/crud-menu"
import { RESULT_OK } from "~/lib/util"

function renderMainImageSelector({ category, galleryAPIService, update, setUpdatedCategoryId }) {

    const styles = {
        mainImageContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "4px"
        },
    
        mainImageButton: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            cursor: "pointer"
        }
    }
    const [LoadMainImageDialogIsOpened, setLoadMainImageDialogIsOpened] = useState(false)
    const [mainPhoto, setMainPhoto] = useState(null)

    useEffect(() => {
        if (category != null)
            galleryAPIService.getCategoryMainPhoto(category).then(img => {
                setMainPhoto(img)
            }).catch(() => {
                setMainPhoto(null)
            })
    }, [category?.mainPhoto])

    const handleOpenLoadMainImageDialog = (event) => {
        if (category != null)
            setLoadMainImageDialogIsOpened(true)
    }

    const handleLoadMainImageDialogConfirm = async (uploadable) => {
        setLoadMainImageDialogIsOpened(false)
        if (uploadable != null) {
            const response = await galleryAPIService.uploadCategoryMainPhoto(category, uploadable)
            if (response.result != RESULT_OK)
                alert(response.error)
            setUpdatedCategoryId(category.id)
            update()
        }
    }

    const handleLoadMainImageDialogCancel = () => {
        setLoadMainImageDialogIsOpened(false)
    }

    const MainImageContainer = () => {

        return (
            <div style={styles.mainImageContainer}>
                <div
                    style={styles.mainImageButton}
                    onClick={(event) => {handleOpenLoadMainImageDialog(event)}}
                >
                        <IconButton>
                            <CloudUploadOutlinedIcon />
                        </IconButton>
                </div>
            </div>
        )
    }

    if (LoadMainImageDialogIsOpened) {
        return (
            <>
                <MainImageContainer />
                <LoadMainImageDialog
                    isOpened={LoadMainImageDialogIsOpened}
                    handleOK={handleLoadMainImageDialogConfirm}
                    handleClose={handleLoadMainImageDialogCancel}
                    image={mainPhoto}
                />
            </>
        )
    } else {
        return <MainImageContainer />
    }

}

function renderCategories(categories) {

    return categories.map(category => {
        return (
            <MenuItem
                    key={category.id}
                    value={category.id}>
                {category.name}
            </MenuItem>
        )
    })

}

export default function MainBar({ galleryAPIService }) {

    const styles = {
        formContainer: {
            padding: "5px 10px 10px 10px"
        },
    
        categoryBlock: {
            display: "flex",
            paddingBottom: "4px"
        },
    
        categorySelector: {
            width: "100%"
        },
    
        descriptionBlock: {
            display: "flex"
        },

        updateButtonContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    }

    const category = useSelector(selectCategory)
    const user = useSelector(selectUser)
    const guest = useSelector(selectGuest)

    const dispatch = useDispatch()

    const [menuParent, setMenuParent] = useState(null)
    const [userMenuParent, setUserMenuParent] = useState(null)
    const [removeCategoryAlertDialogIsOpened, setRemoveCategoryAlertDialogIsOpened] = useState(false)
    const [addCategoryDialogIsOpened, setAddCategoryDialogIsOpened] = useState(false)
    const [editCategoryNameDialogIsOpened, setEditCategoryNameDialogIsOpened] = useState(false)
    const [updatedCategoryId, setUpdatedCategoryId] = useState(null)
    const [categories, setCategories] = useState([])

    const handleCategoryChange = (id) => {
        if (id) {
            const _index = categories.findIndex(cat => cat.id === id)
            if (_index != -1) {
                dispatch(setCategory(categories[_index]))
            } else if (categories.length) {
                dispatch(setCategory(categories[0]))
            } else {
                dispatch(setCategory(null))
            }
        } else {
            if (id != 0) {
                dispatch(setCategory(null))
            }
        }
    }

    const handleMenuOpen = (event) => {
        setMenuParent(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuParent(null)
    }

    const handleUserMenuOpen = (event) => {
        setUserMenuParent(event.currentTarget)
    }

    const handleUserMenuClose = () => {
        setUserMenuParent(null)
    }

    const handleUserSignOut = () => {
        handleUserMenuClose()

        galleryAPIService.signOut().then(() => {
            dispatch(setIsAuthorized(false))
        }).catch((err) => {
            alert(err)
        })
    }

    const handleOpenDeleteCategoryDialog = () => {
        handleMenuClose()
        if (category != null)
            setRemoveCategoryAlertDialogIsOpened(true)
    }

    const handleRemoveCategoryConfirm = () => {
        // Prevent errors with remove undefined category
        if (category != null) {
            galleryAPIService.removeCategory(category.id).then(() => {
                setRemoveCategoryAlertDialogIsOpened(false)
                setUpdatedCategoryId(category.id)
                update()
            })
        }
    }

    const handleRemoveCategoryCancel = () => {
        setRemoveCategoryAlertDialogIsOpened(false)
    }

    const handleOpenCreateCategoryDialog = () => {
        handleMenuClose()
        setAddCategoryDialogIsOpened(true)
    }

    const handleAddCategoryCancel = () => {
        setAddCategoryDialogIsOpened(false)
    }

    const handleAddCategoryConfirm = (categoryName) => {
        if (categoryName && /\S+/.test(categoryName)) {
            galleryAPIService.addCategory(categoryName).then((data) => {
                if (data.result === "ok") {
                    setAddCategoryDialogIsOpened(false)
                    setUpdatedCategoryId(data.response.id)
                    update()
                } else {
                    setAddCategoryDialogIsOpened(false)
                    alert(data.error)
                }
            })
        } else {
            alert("Category name must contain alphabet symbols or(and) numbers")
        }
    }

    const handleOpenEditCategoryDialog = () => {
        handleMenuClose()
        if (category)
            setEditCategoryNameDialogIsOpened(true)
    }

    const handleEditCategoryNameCancel = () => {
        setEditCategoryNameDialogIsOpened(false)
    }

    const handleEditCategoryNameConfirm = (categoryName) => {
        if (categoryName && /\S+/.test(categoryName)) {
            if (category != null) {
                setEditCategoryNameDialogIsOpened(false)
                const modified = { ...category, name: categoryName }
                handleCategoryUpdate(modified)
            }
        } else {
            alert("Category name must contain alphabet symbols or(and) numbers")
        }
    }

    const handleCategoryDescriptionChange = (event) => {
        if (category != null)
            dispatch(setCategory({...category, description: event.target.value}))
    }

    const handleCategoryUpdate = (modified) => {
        galleryAPIService.updateCategory(modified).then((data) => {
            if (data.result === "ok") {
                const updated = data.response
                const _index = categories.findIndex(cat => cat.id === updated.id)
                if (_index != -1)
                    setUpdatedCategoryId(updated.id)
                    setCategories((prevCategories) => {
                        const newCategories = [...prevCategories]
                        newCategories[_index] = updated
                        return newCategories
                    })
            } else {
                alert(data.error)
            }
        })
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const categoriesData = await galleryAPIService.getCategories()
                if (categoriesData.result === "ok")
                    setCategories(categoriesData.response)
            } catch (e) {
                console.log(`Cannot get categories: ${e}`)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        handleCategoryChange(updatedCategoryId)
    }, [categories])

    useEffect(() => {
        if (category && !guest) {
            const autosave = setTimeout(() => {
                handleCategoryUpdate(category)
            }, 500)
            return () => clearTimeout(autosave)
        }
    }, [category?.description])

    const update = () => {
        galleryAPIService.getCategories().then((data) => {
            if (data.result === "ok") {
                setCategories(data.response)
            } else {
                alert(data.error)
            }
        })
    }

    return (
        <div>
            <AppBar position="relative">
                <div style={styles.formContainer}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Photo Gallery Admin Panel
                        </Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography>{user}</Typography>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="user-menu-appbar"
                                aria-haspopup="true"
                                onClick={handleUserMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="user-menu-appbar"
                                anchorEl={userMenuParent}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(userMenuParent)}
                                onClose={handleUserMenuClose}
                            >
                                <MenuItem key="log-out" onClick={handleUserSignOut}>Log out</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                    <FormControl style={{minWidth: "100%"}} variant="outlined" size="small">
                        <div style={styles.categoryBlock}>
                            <Select value={
                                        category != null
                                            ? category.id
                                            : ''
                                    }
                                    style={styles.categorySelector}
                                    onChange={e => handleCategoryChange(e.target.value)}>
                                { renderCategories(categories) }
                            </Select>
                            <Box>
                                <IconButton onClick={handleMenuOpen}>
                                    <MoreIcon />
                                </IconButton>
                            </Box>
                        </div>
                        <div style={styles.descriptionBlock}>
                            { renderMainImageSelector({category, galleryAPIService, update, setUpdatedCategoryId}) }
                            <TextField
                                minRows={10}
                                maxRows={10}
                                variant="outlined"
                                multiline
                                value={
                                    category != null
                                        ? category.description != null
                                            ? category.description
                                            : ""
                                        : ""
                                }
                                fullWidth
                                onChange={handleCategoryDescriptionChange}
                            />
                        </div>
                    </FormControl>
                </div>
            </AppBar>
            <AlertDialog
                title="Alert!"
                contentText="Delete this category with photos?"
                isOpened={removeCategoryAlertDialogIsOpened}
                handleOK={handleRemoveCategoryConfirm}
                handleClose={handleRemoveCategoryCancel}
            />
            <InputDialog
                title="Add new category"
                label="Category name"
                isOpened={addCategoryDialogIsOpened}
                handleOK={handleAddCategoryConfirm}
                handleClose={handleAddCategoryCancel}
            />
            <InputDialog
                title="Change category name"
                label="Category name"
                isOpened={editCategoryNameDialogIsOpened}
                handleOK={handleEditCategoryNameConfirm}
                handleClose={handleEditCategoryNameCancel}
            />
            <CRUDMenu
                menuParent={menuParent}
                handleMenuClose={handleMenuClose}
                handleOpenCreateDialog={handleOpenCreateCategoryDialog}
                handleOpenEditDialog={handleOpenEditCategoryDialog}
                handleOpenDeleteDialog={handleOpenDeleteCategoryDialog}
            />
        </div>
    )

}