import React from "react"
import withTheme from "../hoc/with-theme"
import Button from "../button/button"
import styles from "./header.module.scss"

const Header = ({ user, toggleTheme, mainPhoto, name, description }) => {

    return (
        <>
        <div className={styles.HeaderActions}>
            <Button><a target="_blank" href="/admin">{ !user ? "Sign In" : "Admin panel" }</a></Button>
            <Button onClick={toggleTheme}>Theme</Button>
        </div>
        <div className={styles.HeaderActionsSmall}>
            <Button onClick={toggleTheme}>Theme</Button>
        </div>
        <div className={styles.HeaderBanner}>
            <img className={styles.HeaderBannerPhoto} src={mainPhoto} alt="mainPhoto"/>
            <div className={styles.HeaderBannerOverlay}></div>
            <div className={styles.HeaderTitle}>
                <h1>{name}</h1>
                <h2>{description}</h2>
            </div>
        </div>
        </>
    )

}

export default withTheme(Header)