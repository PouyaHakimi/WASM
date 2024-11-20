import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

function StudentLayout() {

    return (
        <>
            <h1> <Header /></h1>
            <footer><Footer/></footer>
            <Outlet />
        </>
    )

}

export default StudentLayout