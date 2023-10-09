import { resultError } from "~/lib/util"

export default async function unauthorized(req, res) {

    res.status(401).json(resultError("Unauthorized"))

}