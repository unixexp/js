import Head from "next/head";
import ThemeProvider from "~/components/client/theme-context/theme-provider";
import APIProvider from "~/components/client/api-context/api-provider";
import MainPage from "~/components/client/main-page/main-page";

export async function getStaticProps(context) {
    return {
      props: {
        API_SERVER: process.env.API_SERVER
      }
    }
}

export default function IndexPage(props) {

    return (
        <>
        <Head>
            <title>Photo-Gallery</title>
        </Head>
        <ThemeProvider>
            <APIProvider API_SERVER={props.API_SERVER}>
                <MainPage />
            </APIProvider>
        </ThemeProvider>
        </>
    );

}
