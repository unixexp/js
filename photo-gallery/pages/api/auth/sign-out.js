import { prisma } from "~/lib/db"
import { resultOK, resultError, makeUUID, makeUUIDBuffered } from "~/lib/util"

export default async function signOut(req, res) {

    if (req.method === "POST") {

        const { refreshToken } = req.body

        // Find refresh session in DB
        let session = null
        try {
            session = await prisma.RefreshSession.findUnique({ where: { refreshToken: refreshToken } })
            if (!session) {
                return res.status(500).json(resultError("Error sign out (2)"))
            }
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError("Error sign out (3)"))
            return
        }

        // Delete session
        try {
            await prisma.RefreshSession.delete({ where: { id: session.id } })
            res.status(200).json(resultOK())
        } catch (e) {
            console.log(e)
            return res.status(500).json(resultError("Error sign out (4)"))
        }

    }

}
