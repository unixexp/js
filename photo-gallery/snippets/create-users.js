import {
    v4 as uuidV4,
    parse as uuidParse
} from "uuid";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

const makeUUIDBuffered = () => {
    return convertUUIDStringToBuffered(uuidV4())
}

const convertUUIDStringToBuffered = (uuid) => {
    return Buffer.from(uuidParse(uuid))
}

async function hashPassword(plaintextPassword) {
    return await bcrypt.hash(plaintextPassword, 10);
}

async function comparePassword(plaintextPassword, hash) {
    return await bcrypt.compare(plaintextPassword, hash);
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:../photo-gallery.db"
        }
    }
})

const usersToCreate = [
    { login: "guest", password: "guest", role: "guest" },
    { login: "admin", password: "friend", role: "admin" }
]

async function createUsers() {
    // Create
    const statements = [ prisma.User.deleteMany({}) ]
    for (let user of usersToCreate) {
        statements.push(
            prisma.User.create({
                data: {
                    id: makeUUIDBuffered(),
                    login: user.login,
                    password: await hashPassword(user.password),
                    role: user.role
                }
            })
        )
    }

    try {
        await prisma.$transaction(statements)
    } catch (e) {
        console.log(e)
    }

    // Check password hashing
    let users = []
    try {
        users = await prisma.User.findMany({})
    } catch (e) {
        console.log(e)
    }

    const compared = []
    for (let user of users) {
        const index = usersToCreate.findIndex(el => el.login === user.login)
        if (index != -1) {
            const compareResult = await comparePassword(usersToCreate[index].password, user.password)
            if (!compareResult) {
                console.log(`Error test password after creating for user ${user.login}`)
            } else {
                compared.push(usersToCreate[index])
            }
        }
    }

    if (compared.length != usersToCreate.length) {
        try {
            await prisma.User.deleteMany({})
        } catch (e) {
            console.log(e)
        }
    } else {
        for (let user of compared) {
            console.log(`Created user '${user.login}' with password '${user.password}'`)
        }
    }
    
    prisma.$disconnect()
}

createUsers()
