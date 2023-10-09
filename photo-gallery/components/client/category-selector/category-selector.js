import React from "react"
import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import withAPI from "../hoc/with-api"
import { setCategory } from "../../app/appSlice"

import styles from "./category-selector.module.scss"

const POSITION_START = 1;
const POSITION_MIDDLE = 2;
const POSITION_END = 3;

const CategorySelector = ({ categories, galleryAPIService }) => {

    const dispatch = useDispatch()
    const items = useRef([])
    const track = useRef(null)
    const body = useRef(null)
    const [categoriesPhotos, setCategoriesPhotos] = useState([])

    const [state, setState] = useState({
        offset: 0,
		maxOffset: 0,
		position: POSITION_START
    })

    useEffect(() => {
        async function fetchData() {
            const data = []
            for (let i in categories) {
                const category = categories[i]
                try {
                    const response = await galleryAPIService.getCategoryMainPhoto(category)
                    data.push({
                        id: category.id,
                        src: response,
                        name: category.name
                    })
                } catch(e) {
                    console.log(e)
                    data.push(null)
                }
            }

            setCategoriesPhotos(data)
        }
        
        fetchData()
        items.current = items.current.slice(0, categories.length)

    }, [categories])

    const slideLeft = () => {
        setState((prevState) => {
            const newState = Object.assign({}, prevState)

            const itemInterval = parseInt((window.getComputedStyle(items.current[0])).marginRight)
            const minOffset = 0
            const offset = prevState.offset + (items.current[0].offsetWidth + itemInterval)
            const nextOffset = offset + (items.current[0].offsetWidth + itemInterval)

            if (nextOffset >= minOffset) {
                newState.offset = 0
                newState.position = POSITION_START
            } else {
                newState.offset = offset
                newState.position = POSITION_MIDDLE
            }

            return newState
        })
    }

    const slideRight = () => {
        setState((prevState) => {
            const newState = Object.assign({}, prevState)

            const itemInterval = parseInt((window.getComputedStyle(items.current[0])).marginRight)
            const maxOffset = track.current.offsetWidth - body.current.offsetWidth
            const offset = prevState.offset - (items.current[0].offsetWidth + itemInterval)
            const nextOffset = offset - (items.current[0].offsetWidth + itemInterval)

            if (maxOffset > 0) {
                if (Math.abs(nextOffset) >= maxOffset) {
                    newState.offset = maxOffset * -1
                    newState.position = POSITION_END
                } else {
                    newState.offset = offset
                    newState.position = POSITION_MIDDLE
                }
            } else {
                newState.offset = offset
                newState.maxOffset = maxOffset
                newState.position = POSITION_MIDDLE
            }

            return newState
        })
    }

    const changeCategory = (event) => {
        if (event.target === event.currentTarget) {
            const index = categories.findIndex(el => el.id === event.currentTarget.dataset.id)
            if (index != -1)
            dispatch(setCategory(categories[index]))
        }
    }

    return (
        <div className={styles.CategorySelector}>
            <div className={styles.CategorySelectorArrow}>
                <svg className={
                            categories.length < 4 || state.position === POSITION_START
                            ? styles.CategorySelectorArrowImgDisabled
                            : styles.CategorySelectorArrowImg}
                    viewBox="0 0 32 32" onClick={slideLeft}>
                        <use xlinkHref={`icons.svg#ArrowLeft`}></use>
                </svg>
            </div>
            <div
                className={styles.CategorySelectorBody}
                style={categories.length < 3 ? { width: "auto" } : {}}
                ref={body}>
                <div
                    className={styles.CategorySelectorTrack}
                    ref={track}
                    style={{marginLeft: `${state.offset}px`}}>
                    {
                        categoriesPhotos.map((item, i) => {
                            return (
                                <div
                                    className={styles.CategorySelectorItem}
                                    key={item.id} 
                                    ref={el => items.current[i] = el}
                                >
                                    <div className={styles.CategorySelectorItemImage}>
                                        <img alt={item.id} src={item.src}/>
                                    </div>

                                    <div
                                        data-id={item.id}
                                        className={styles.CategorySelectorItemHoverEffect}
                                        onClick={changeCategory}
                                        >
                                        {item.name}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={styles.CategorySelectorArrow}>
                <svg className={
                            categories.length < 4 || state.position === POSITION_END
                            ? styles.CategorySelectorArrowImgDisabled
                            : styles.CategorySelectorArrowImg}
                    viewBox="0 0 32 32" onClick={slideRight}>
                    <use xlinkHref={`icons.svg#ArrowRight`}></use>
                </svg>
            </div>
        </div>
    )

}

export default withAPI(CategorySelector)