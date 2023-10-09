import Head from "next/head"
import Layout from "../components/admin/layout/layout"
import Container from "../components/admin/container/container"
import MainBar from "../components/admin/main-bar/main-bar"
import PhotoEditor from "../components/admin/photo-editor/photo-editor"
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from "@mui/material"

import { Box, CircularProgress } from "@mui/material"

import useAuth from "../components/admin/hooks/use-auth"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

const theme = createTheme({
    components: {
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    "div:not(:last-child)": {
                        marginBottom: "8px"
                    }
                }
            }
        }
    }
})

export async function getStaticProps(context) {
    return {
      props: {
        API_SERVER: process.env.API_SERVER
      }
    }
}

function AdminPage(props) {

    const galleryAPIService = GalleryAPIServiceFactory.getAdminInstance(props.API_SERVER)

    return (
        <ThemeProvider theme={theme}>
            <Layout>
                <Head>
                    <title>Admin panel</title>
                </Head>
                {SecureAdminPageContent({...props, galleryAPIService})}
            </Layout>
        </ThemeProvider>
    )
    
}

const SecureAdminPageContent = (props) => {

    const { galleryAPIService } = props
    const isAuthorized = useAuth(galleryAPIService, "/admin")

    if (isAuthorized) {
        return (
            <Container>
                <MainBar
                    galleryAPIService={galleryAPIService}
                />
                <Box sx={{ padding: "8px"}}>
                    <PhotoEditor galleryAPIService={galleryAPIService}/>
                </Box>
            </Container>
        )
    } else {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                minHeight: "100vh"
            }}>
                <CircularProgress/>
            </Box>
        )
    }
}

export default AdminPage