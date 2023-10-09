import { useSelector, useDispatch } from "react-redux"
import { selectIsAuthorized, setIsAuthorized, setUser, setGuest } from "~/components/app/appSlice"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'

export default function useAuth(galleryAPIService, callbackURL) {

    const dispatch = useDispatch()
    const isAuthorized = useSelector(selectIsAuthorized)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        galleryAPIService.isAuthorized().then((response) => {
            const guest = localStorage.getItem("role") !== "admin" ? true : false
            dispatch(setIsAuthorized(true))
            dispatch(setUser(localStorage.getItem("login")))
            dispatch(setGuest(guest))
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            dispatch(setIsAuthorized(false))
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (!isAuthorized && !loading)
            router.push(galleryAPIService.getRouteURL("/auth/signin?callbackURL=" + galleryAPIService.getRouteURL(callbackURL)))
    }, [isAuthorized, loading])

    return isAuthorized

}