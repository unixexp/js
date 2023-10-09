import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import styles from "./main-page.module.scss"
import withTheme from "../hoc/with-theme"
import withAPI from "../hoc/with-api"
import Header from "../header/header"
import CategorySelector from "../category-selector/category-selector"
import Photos from "../photos/photos"
import { RESULT_OK } from "~/lib/util"

import useAuth from "../hooks/use-auth"
import { selectCategory, setCategory, selectUser } from "../../app/appSlice"

const MainPage = ({ theme, galleryAPIService }) => {

    useAuth(galleryAPIService, "/admin")

    const [photos, setPhotos] = useState([])
    const category = useSelector(selectCategory)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    const [categories, setCategories] = useState([])
    const [mainPhoto, setMainPhoto] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const categoriesData = await galleryAPIService.getCategories()
                if (categoriesData.result === RESULT_OK && categoriesData.response.length) {
                    setCategories(categoriesData.response)
                    dispatch(setCategory(categoriesData.response[0]))
                }
            } catch (e) {
                console.log(`Cannot get categories: ${e}`)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await galleryAPIService.getCategoryMainPhoto(category)
                setMainPhoto(response)
            } catch {
                console.log(`Cannot load main photo for category ${category.id}`)
                setMainPhoto(null)
            }
    
            try {
                const answer = await galleryAPIService.getCategoryPhotos(category)
                if (answer.result === RESULT_OK) {
                    setPhotos(answer.response)
                } else {
                    console.log(`Cannot load photos: ${e}`)
                    setPhotos([])
                }
            } catch (e) {
                console.log(`Cannot load photos: ${e}`)
                setPhotos([])
            }
        }

        if (category) {
            fetchData()
        }
    }, [category])

    const displayCategorySelector = () => {
        if (categories.length > 1)
            return (
                <div className={`${styles.MainPageCategories}`}>
                    <CategorySelector categories={categories}/>
                </div>
            )
        else
            return
    }

    const displayPhotos = () => {
        return (
            <div className={`${styles.MainPagePhotos}`}>
                <Photos photos={photos}/>
            </div>
        )
    }

    return (
        <div className={`${styles.MainPage} ${theme}`}>
            <Header user={user}
                    mainPhoto={mainPhoto}
                    name={category?.name}
                    description={category?.description}
            />
            {displayCategorySelector()}
            {displayPhotos()}
        </div>
    )
}

export default withTheme(withAPI(MainPage))