import { resultOK, resultError } from "~/lib/util"

import JWTService from "~/services/jwt-service";

export default async function verify(req, res) {

    if (req.method === "POST") {

        const { accessToken } = req.body

        const jwtService = new JWTService(process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET)
        try {
            const token = await jwtService.verifyAccessToken(accessToken)
            res.status(200).json(resultOK({accessToken, token}))
        } catch (error) {
            console.log(error)
            res.status(401).json(resultError("Unauthorized"))
        }

    }

}