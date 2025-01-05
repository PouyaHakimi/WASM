import { Outlet } from "react-router-dom"
import ApiServerHeader from "../components/headers/apiServerHeader"
import Footer from "../components/Footer"

function apiServerLayout(props) {

    return (
        <>
            <h1> <ApiServerHeader search={props.search} setSearch={props.setSearch} setSearchData={props.setSearchData}/></h1>

            {/* <footer><Footer/></footer> */}
            <Outlet />
        </>
    )

}

export default apiServerLayout