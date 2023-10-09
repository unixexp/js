import { prisma } from "~/lib/db"
import { resultOK, resultError, makeUUID, makeUUIDBuffered } from "~/lib/util"

import JWTService from "~/services/jwt-service"

export default async function refreshTokens(req, res) {

    if (req.method === "POST") {

        const { refreshToken } = req.body

        // Find refresh session in DB
        let session = null
        try {
            session = await prisma.RefreshSession.findUnique({
                where: { refreshToken: refreshToken },
                include: { User: true }
            })

            if (!session) {
                return res.status(500).json(resultError("Error refresh session (2)"))
            }
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError("Error refresh session (3)"))
            return
        }

        const jwtService = new JWTService(process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET)
        try {
            await jwtService.verifyRefreshToken(session.refreshToken)

            // Delete old session
            try {
                await prisma.RefreshSession.delete({ where: { id: session.id } })
            } catch (e) {
                console.log(e)
                console.log(session)
            }

            // Refresh tokens
            const { accessToken, refreshToken: updatedRefreshToken, refreshTokenExpires } =
                jwtService.getToken({ login: session.User.login, role: session.User.role })

            // Add session to DB
            const newSession = {
                data: {
                    id: makeUUIDBuffered(),
                    refreshToken: updatedRefreshToken,
                    expiresIn: refreshTokenExpires,
                    User: { connect: { id: session.userId } }
                }
            }
        
            try {
                await prisma.RefreshSession.create(newSession)

                res.status(200).json(resultOK({
                    accessToken,
                    refreshToken: updatedRefreshToken,
                    refreshTokenExpires
                }))
            } catch (e) {
                console.log(e)
                if (e.code === "P2002") {
                    res.status(409).json(resultError("Error refresh session (5)"))
                } else {
                    res.status(500).json(resultError("Error refresh session (6)"))
                }
            }
        } catch (error) {
            console.log(error)
            res.status(401).json(resultError("Error refresh session (7)"))
        }

    }

}
