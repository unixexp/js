import { useSelector, useDispatch } from "react-redux"
import { selectIsAuthorized, setIsAuthorized, setUser } from "~/components/app/appSlice"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'

export default function useAuth(galleryAPIService) {

    const dispatch = useDispatch()
    const isAuthorized = useSelector(selectIsAuthorized)

    const router = useRouter()

    useEffect(() => {
        galleryAPIService.isAuthorized().then((response) => {
            dispatch(setIsAuthorized(true))
            dispatch(setUser(localStorage.getItem("login")))
        }).catch((err) => {
            console.log(err)
            dispatch(setIsAuthorized(false))
        })
    }, [])

    return isAuthorized

}