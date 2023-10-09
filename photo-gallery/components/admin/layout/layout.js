import styles from "./layout.module.scss";

export default function Layout({children, theme}) {

    return <div className={`${styles.page} ${theme}`}>{children}</div>
}