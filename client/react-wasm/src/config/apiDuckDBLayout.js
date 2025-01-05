import { Outlet } from "react-router-dom"
import WasmApiDuckDbHeader from "../components/headers/wasmApiDuckDbHeader"
import Footer from "../components/Footer"

function apiDuckDBLayout(props) {

    return (
        <>
            <h1> <WasmApiDuckDbHeader search={props.search} setSearch={props.setSearch} setSearchData={props.setSearchData}/></h1>

            {/* <footer><Footer/></footer> */}
            <Outlet />
        </>
    )

}

export default apiDuckDBLayout