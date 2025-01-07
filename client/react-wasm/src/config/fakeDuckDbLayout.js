import { Outlet } from "react-router-dom"
import WasmFakeDuckDB from "../components/headers/wasmFakeDuckDB"
import Footer from "../components/Footer"

function fakeDockDbLayout(props) {

    return (
        <>
            <h1> <WasmFakeDuckDB search={props.search} setSearch={props.setSearch}/></h1>

            {/* <footer><Footer/></footer> */}
            <Outlet />
        </>
    )

}

export default fakeDockDbLayout