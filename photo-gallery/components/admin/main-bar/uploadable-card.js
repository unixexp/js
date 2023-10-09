import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"

export default function UploadableCard({currentImage, setUploadableHandler, size, caption}) {

    const handleUploadToState = (event) => {
        if (event.target.files && event.target.files[0]) {
            const uploadable = event.target.files[0]
            setUploadableHandler(uploadable)
        }
    }

    if (currentImage != null) {
        return (
            <Card>
                <label style={{cursor: "pointer"}}>
                    <CardMedia
                        component="img"
                        height={size}
                        image={currentImage}
                    />
                    <input style={{display: "none"}} type="file" onChange={handleUploadToState} />
                </label>
            </Card>
        )
    } else {
        return (
            <div style={{textAlign: "center"}}>
                <Button variant="contained" component="label" onChange={handleUploadToState}>
                    {caption}
                    <input hidden accept="image/*" type="file" />
                </Button>
            </div>
        )
    }

}