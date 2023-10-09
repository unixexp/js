import {
    Container,
    TextField,
    Box,
    Button,
    CssBaseline,
    Avatar,
    Typography,
    Grid,
    Link
} from "@mui/material"
import Head from "next/head"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState } from "react"
import { useRouter } from 'next/router'
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

export async function getStaticProps(context) {
    return {
      props: {
        API_SERVER: process.env.API_SERVER
      }
    }
}

export default function SignInPage(props) {

    const galleryAPIService = GalleryAPIServiceFactory.getAdminInstance(props.API_SERVER)

    const [userInfo, setUserInfo] = useState({ login: "", password: "" })
    let router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        galleryAPIService.signIn(userInfo.login, userInfo.password).then(res => {
            const callbackURL = router.query["callbackURL"]
            if (callbackURL != null && callbackURL != "")
                router.push(callbackURL)
            else
                router.push("/")
        }).catch((err) => {
            alert(err)
        })
    }

    return (
        <>
            <Head>
                <title>Sign in</title>
            </Head>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="login"
                            label="Login"
                            name="login"
                            autoComplete="login"
                            autoFocus
                            value={userInfo.login}
                            onChange={(e) => setUserInfo({ ...userInfo, login: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={userInfo.password}
                            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    )

}