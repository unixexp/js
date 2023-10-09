import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import { useSelector } from "react-redux"
import { selectGuest } from "~/components/app/appSlice"

export default function AlertDialog({ title, contentText, isOpened, handleOK, handleClose }) {

    const guest = useSelector(selectGuest)

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
                    <DialogContentText>
                        { contentText }
                    </DialogContentText>
                    <DialogActions>
                        <Button disabled={guest} onClick={handleOK}>Ok</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}