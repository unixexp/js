import { delay, RESULT_OK } from "~/lib/util"

class TokenAlreadyRefreshedError extends Error {}

export default class GalleryAPIService {

    constructor(apiServer) {

        this.id = Math.floor(Math.random() * 100)
        this.API_SERVER = apiServer
        this.API_ROUTES = {
            signIn: "/api/auth/sign-in",
            signOut: "/api/auth/sign-out",
            verify: "/api/auth/verify",
            refreshTokens: "/api/auth/refresh-tokens"
        }
        this.PATHS = {
            categoryPath: "/categories/<id>",
            photosPath: "/photos",
            photosThumbnailsPath: "/photos/thumbnails",
            mainPhotoPath: "/categories/<id>/photos/main"
        }
        this.isTokensRefreshing = false
        this.debug = false
    }

    signIn = async (login, password, callbackURL = null) => {
        const path = this.getRouteURL("signIn")
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({login: login, password: password, callbackURL: callbackURL})
        })
        const answer = await response.json()

        if (answer.result === RESULT_OK && answer.response.accessToken != null) {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            localStorage.setItem("access_token", answer.response.accessToken)
            localStorage.setItem("refresh_token", answer.response.refreshToken)
            localStorage.setItem("login", answer.response.login)
            localStorage.setItem("role", answer.response.role)
            return answer
        } else {
            throw new Error(answer.error)
        }
    }

    verifyAccessToken = async (token) => {
        const path = this.getRouteURL("verify")
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ accessToken: token })
        })
        return await response.json()
    }

    requestWithAuth = async (f, url = null, log = false) => {
        if (url != null && this.debug)
            console.log(`requestWithAuth: ${url}`)

        let accessToken = localStorage.getItem("access_token")
        const refreshToken = localStorage.getItem("refresh_token")

        if (accessToken == null) {
            if (refreshToken != null) {
                try {
                    await this.refreshTokens()
                } catch (e) {
                    if (!(e instanceof TokenAlreadyRefreshedError))
                        throw e
                }
                accessToken = localStorage.getItem("access_token")
            } else {
                throw new Error("Unauthorized")
            }
        }
        
        let response = await f({ "Authorization": `Bearer ${accessToken}` })
        if (response.status == 401) {
            if (refreshToken != null) {
                try {
                    await this.refreshTokens()
                } catch (e) {
                    if (!(e instanceof TokenAlreadyRefreshedError))
                        throw e
                }
                accessToken = localStorage.getItem("access_token")
            } else {
                throw new Error("Unauthorized")
            }

            if (this.debug)
                console.log(`Retry: ${url} - ${Date.now()}`)

            response = await f({ "Authorization": `Bearer ${accessToken}` })
            if (response.status == 401) {
                throw new Error("Unauthorized")
            } else {
                return response
            }
        } else {
            return response
        }
    }

    isAuthorized = async () => {
        const accessToken = localStorage.getItem("access_token")
        const refreshToken = localStorage.getItem("refresh_token")

        if (accessToken != null) {
            let verified = await this.verifyAccessToken(accessToken)
            if (verified.result === RESULT_OK && verified.response.accessToken != null) {
                return verified.response
            } else {
                if (refreshToken != null) {
                    try {
                        await this.refreshTokens()
                    } catch (e) {
                        if (!(e instanceof TokenAlreadyRefreshedError))
                            throw e
                    }
                } else {
                    throw new Error(verified.error)
                }
            }
        } else {
            if (refreshToken != null) {
                try {
                    await this.refreshTokens()
                } catch (e) {
                    if (!(e instanceof TokenAlreadyRefreshedError))
                        throw e
                }
            } else {
                throw new Error("Unauthorized")
            }
        }
    }

    refreshTokens = async () => {
        let refreshedByOtherRequest = false
        while (this.isTokensRefreshing) {
            if (this.debug)
                console.log("Waiting for tokens refresh...")
            refreshedByOtherRequest = true
            await delay(1)
        }

        if (refreshedByOtherRequest)
            throw new TokenAlreadyRefreshedError("Token already refreshed by other")

        this.isTokensRefreshing = true
        const refreshToken = localStorage.getItem("refresh_token")

        if (refreshToken != null) {
            const path = this.getRouteURL("refreshTokens")
            const response = await fetch(path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken: refreshToken })
            })
            const answer = await response.json()
            if (answer.result === RESULT_OK && answer.response.accessToken != null) {
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                localStorage.setItem("access_token", answer.response.accessToken)
                localStorage.setItem("refresh_token", answer.response.refreshToken)
                this.isTokensRefreshing = false
                return answer
            } else {
                this.isTokensRefreshing = false
                throw new Error(answer.error)
            }
        } else {
            this.isTokensRefreshing = false
            throw new Error("Cannot refresh session (1)")
        }
    }

    signOut = async () => {
        const refreshToken = localStorage.getItem("refresh_token")

        if (refreshToken != null) {
            const path = this.getRouteURL("signOut")
            const response = await fetch(path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken: refreshToken })
            })
            const answer = await response.json()
            if (answer.result === RESULT_OK) {
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                localStorage.removeItem("login")
                return answer
            } else {
                throw new Error(answer.error)
            }
        } else {
            throw new Error("Error sign out (1)")
        }
    }

    getRouteURL = (route) => {
        let url
        if (route in this.API_ROUTES)
            url = new URL(this.API_ROUTES[route], this.API_SERVER)
        else
            url = new URL(route, this.API_SERVER)

        return url.href
    }

}