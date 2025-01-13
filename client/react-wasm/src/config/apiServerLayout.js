import { Outlet } from "react-router-dom"
import MainHeader from "../components/headers/mainHeader"
import Footer from "../components/Footer"

function apiServerLayout(props) {

    return (
        <>
            <h1> <MainHeader search={props.search} setSearch={props.setSearch} /></h1>

            {/* <footer><Footer/></footer> */}
            <Outlet />
        </>
    )

}

export default apiServerLayout