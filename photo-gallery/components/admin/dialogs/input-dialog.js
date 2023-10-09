import { useState } from "react"
import { useSelector } from "react-redux"
import { selectGuest } from "~/components/app/appSlice"

import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

export default function InputDialog({
        title,
        contentText,
        label,
        isOpened,
        handleOK,
        handleClose
    }) {

    const [value, setValue] = useState('')
    const guest = useSelector(selectGuest)

    const handleOnChangeValue = (e) => {
        setValue(e.target.value)
    }

    const callOkHandler = () => {
        handleOK(value)
        setValue('')
    }

    return (
        <div>
            <Dialog
                open={isOpened}
                onClose={handleClose}
            >
                <DialogTitle>
                    { title }
                </DialogTitle>
                <DialogContent>
                    { contentText && <DialogContentText>{ contentText }</DialogContentText>}
                    <TextField
                        autoFocus
                        margin="dense"
                        label={label}
                        type="text"
                        fullWidth
                        variant="standard"
                        value={value}
                        onChange={handleOnChangeValue}
                    />
                    <DialogActions>
                        <Button disabled={guest} onClick={callOkHandler}>Ok</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}