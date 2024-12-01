import { useEffect, useState } from "react";
import { getDuckDBStd } from "./API/API";
import DockDBTable from "./components/DockDBTable";


async function DockDB(props) {


        try {

               
            
            const data= await getDuckDBStd();
            console.log(data +"DB ++++++");
            //SetDBdata(data);
             return data
            
        } catch (error) {

            console.error("error of fetching in BrowserDB",error)
            
        }
}




    


  

export default DockDB;