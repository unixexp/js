import jsonwebtoken from "jsonwebtoken"

const DEFAULT_ACCESS_TOKEN_EXPIRES_SECS = 120
const DEFAULT_REFRESH_TOKEN_EXPIRES_SECS = 3600 * 24 * 30

export default class JWTService {

    constructor(accessTokenSecret, refreshTokenSecret) {
        this.accessTokenSecret = accessTokenSecret
        this.refreshTokenSecret = refreshTokenSecret
    }

    getToken = (
        payload,
        accessTokenExpiresSecs = DEFAULT_ACCESS_TOKEN_EXPIRES_SECS,
        refreshTokenExpiresSecs = DEFAULT_REFRESH_TOKEN_EXPIRES_SECS
    ) => {

        // Generate new access-refresh token pair
        const accessTokenExpires = Math.floor(Date.now() / 1000) + accessTokenExpiresSecs
        const refreshTokenExpires = Math.floor(Date.now() / 1000) + refreshTokenExpiresSecs

        const accessToken = jsonwebtoken.sign({
            data: payload,
            exp: accessTokenExpires
        }, this.accessTokenSecret)

        const refreshToken = jsonwebtoken.sign({
            data: payload,
            exp: refreshTokenExpires
        }, this.refreshTokenSecret)

        // Save token pair in global
        const tokenPair = { accessToken, refreshToken, accessTokenExpires, refreshTokenExpires }

        return tokenPair
    }

    verifyToken = async (token, secret, expiresTimeWindow = 0) => {
        return await new Promise((resolve, reject) => {
            jsonwebtoken.verify(token, secret, (err, verifiable) => {
                if (err) {
                    reject("Token signature verification error")
                } else {
                    const shouldRefreshTime = Math.round((verifiable.exp * 1000) - (expiresTimeWindow * 1000) - Date.now())
                    if (shouldRefreshTime > 0) {
                        resolve(verifiable)
                    } else {
                        reject(`Token expired by ${Math.abs(Math.round(shouldRefreshTime / 1000))} seconds`)
                    }
                }
            })
        })
    }

    verifyAccessToken = (token, expiresTimeWindow = 0) => {
        return this.verifyToken(token, this.accessTokenSecret, expiresTimeWindow)
    }

    verifyRefreshToken = (token, expiresTimeWindow = 0) => {
        return this.verifyToken(token, this.refreshTokenSecret, expiresTimeWindow)
    }

}