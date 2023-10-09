import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

export default function CRUDMenu(props) {

    const {
        menuParent,
        handleMenuClose,
        handleOpenCreateDialog,
        handleOpenEditDialog,
        handleOpenDeleteDialog
    } = props
    const isMenuOpen = Boolean(menuParent)

    return (
        <Menu
            anchorEl={menuParent}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem
                key="add"
                onClick={handleOpenCreateDialog}
            >Add</MenuItem>
            <MenuItem
                key="change-name"
                onClick={handleOpenEditDialog}
            >Edit</MenuItem>
            <MenuItem
                key="delete"
                onClick={handleOpenDeleteDialog}
            >Delete</MenuItem>
        </Menu>
    )

}