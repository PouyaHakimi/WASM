import React from "react";

function Footer() {

    const currentYear=new Date().getFullYear()

    return <footer className="footer">
    <p>
        WASM Thesis ©  {currentYear}
    </p>
    </footer>
}

export default Footer;