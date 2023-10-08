import { connect_ws } from "../../ws"
import '@rainbow-me/rainbowkit/styles.css';

import MainComp from "./MainComp";
import { Providers } from "./Providers";


export default function Fund(props) {
    connect_ws()

    return (
        <>
            <Providers env={props.env}>
                <MainComp />
            </Providers>
        </>
    )
}

export async function getServerSideProps() {
    return { props: { "env": { INFURA_API_KEY: process.env.INFURA_API_KEY } } }
}