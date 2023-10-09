import { prisma } from "~/lib/db"
import { makeUUIDBuffered, resultOK, resultError, makeUUID } from "~/lib/util"
import bcrypt from "bcrypt"

import JWTService from "~/services/jwt-service";

export default async function signIn(req, res) {

    if (req.method === "POST") {

        const { login, password, callbackURL } = req.body

        let user = null
        try {
            user = await prisma.user.findUnique({ where: { login: login } })
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError("Error create session (1)"))
            return
        }

        let authenticated = false
        if (user)
            authenticated = await bcrypt.compare(password, user.password)

        if (authenticated) {
            const jwtService = new JWTService(process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET)
            const { accessToken, refreshToken, refreshTokenExpires } =
                jwtService.getToken({ login: user.login, role: user.role })

            // Find sessions
            let sessions = null
            const MAX_SESSION = 2
            try {
                sessions = await prisma.RefreshSession.findMany({
                        where: { userId: user.id },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    })
            } catch (e) {
                console.log(e)
                res.status(500).json(resultError("Error create session (2)"))
                return
            }

            // Delete old session if count too many
            if (sessions.length >= MAX_SESSION) {
                for (let i = 0; i < MAX_SESSION-1; i++) {
                    const session = sessions[i]
                    try {
                        await prisma.RefreshSession.delete({ where: { id: session.id } })
                    } catch (e) {
                        console.log(e)
                        return res.status(500).json(resultError("Error create session (3)"))
                    }
                }
            }

            // Add session to DB
            const session = {
                data: {
                    id: makeUUIDBuffered(),
                    refreshToken: refreshToken,
                    expiresIn: refreshTokenExpires,
                    User: { connect: { id: user.id } }
                }
            }
            let result = null
        
            try {
                result = await prisma.RefreshSession.create(session)

                res.status(200).json(resultOK({
                    login: user.login,
                    role: user.role,
                    accessToken,
                    refreshToken,
                    refreshTokenExpires,
                    callbackURL
                }))
            } catch (e) {
                console.log(e)
                if (e.code === "P2002") {
                    res.status(409).json(resultError("Session already exists"))
                } else {
                    res.status(500).json(resultError("Error create session (4)"))
                }
            }
        } else {
            res.status(401).json(resultError("Login or password mismatch"))
        }

    }

}
