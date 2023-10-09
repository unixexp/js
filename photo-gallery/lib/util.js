import path from "path"
import fs from "fs"
import {
    v4 as uuidV4,
    parse as uuidParse,
    stringify as uuidStringify
} from "uuid"

export const RESULT_OK = "ok"
export const RESULT_ERROR = "error"

export const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const convertUUIDStringToBuffered = (uuid) => {
    return Buffer.from(uuidParse(uuid))
}

export const convertUUIDBufferedToString = (uuid) => {
    return uuidStringify(new Uint8Array(uuid))
}

export const makeUUID = () => {
    return uuidV4()
}

export const makeUUIDBuffered = () => {
    return convertUUIDStringToBuffered(uuidV4())
}

export const resultOK = (data) => {
    if (!data)
        data = null
    return { result: RESULT_OK, response: data }
}

export const resultError = (data) => {
    if (!data)
        data = null
    return { result: RESULT_ERROR, error: data }
}

export const formatString = (string, params) => {
    let modified = string
    if (typeof(params) !== "object") {
        throw new Error("Params should be object (like {params: value})")
    } else {
        for (let param in params) {
            modified = modified.replace("%3C" + param + "%3E", params[param])
            modified = modified.replace("<" + param + ">", params[param])
        }
        return modified
    }
}

export const makePath = (pathName, root = null) => {
    const pathParts = pathName.split("/")
    let checkPath = ""

    if (root != null)
        checkPath = path.join(root, checkPath)

    for (let pathPart of pathParts) {
        if (pathPart.length) {
            checkPath = path.join(checkPath, pathPart)

            if (!fs.existsSync(checkPath))
                fs.mkdirSync(checkPath)

        }
    }

    return checkPath
}

export const loadFile = (filePath) => {

    const notFoundFile = "not-found.jpg"
    const contentTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png"
    }
    let notFound = null
    let contentType = null

    if (!fs.existsSync(filePath)) {
        filePath = `./public/${notFoundFile}`
        notFound = notFoundFile
    }

    for (const [ext, type] of Object.entries(contentTypes)) {
        if (filePath.indexOf(ext) != -1) {
            contentType = type
            break
        }
    }

    const data = fs.readFileSync(filePath)
    return {
        data: data,
        contentType: (contentType != null) ? contentType : contentType,
        notFound
    }

}

export const saveFile = (file, pathName, rewrite = false) => {

    let ext = file.originalFilename.match(/\.[a-zA-Z0-9]*$/)
    const uniqueFileName = makeUUID() + (ext != null ? ext[0] : "")
    const filePath = path.join(pathName, uniqueFileName)

    if (fs.existsSync(filePath))
        if (rewrite)
            fs.unlinkSync(filePath)
        else
            throw new Error(`File already exists: ${uniqueFileName}`)

    const data = fs.readFileSync(file.filepath)
    fs.writeFileSync(filePath, data)

    return uniqueFileName

}

export const delay = (time) =>  {
    return new Promise(resolve => setTimeout(resolve, time));
}