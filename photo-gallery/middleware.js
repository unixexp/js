import { NextResponse } from 'next/server'
import { RESULT_OK } from './lib/util'

export async function middleware(req) {
    return await isAuthMiddleware(req)
}

export const config = {
    matcher: ["/api/admin/secured/:path*"]
}


async function isAuthMiddleware(req) {
    const bearerHeader = req.headers.get("authorization")
    
    if (bearerHeader != null) {
        const bearer = bearerHeader.split(" ")
        if (bearer.length == 2) {
            const token = bearer[1]
            const response = await fetch(process.env.JWT_VERIFY_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ accessToken: token })
            })
            const verified = await response.json()
            let data = null
            if (verified.result === RESULT_OK && verified.response?.accessToken != null) {
                const { token: { data: payload } } = verified.response
                if (payload.role === "admin") {
                    return NextResponse.next()
                } else {
                    return NextResponse.redirect(process.env.JWT_UNAUTHORIZED_URL)
                }
            } else {
                return NextResponse.redirect(process.env.JWT_UNAUTHORIZED_URL)
            }
        } else {
            return NextResponse.redirect(process.env.JWT_UNAUTHORIZED_URL)
        }
    } else {
        return NextResponse.redirect(process.env.JWT_UNAUTHORIZED_URL)
    }
}