import createModule from "../wasm/student2";
import {AsyncDuckDB} from '@duckdb/duckdb-wasm';


const BACKENDURL = 'http://localhost:3001/api'

async function getStudent() {
    const URL =BACKENDURL+'/users';

    try {
        
        const response = await fetch(URL);
        
        
        if (response.ok) {

            const list= await response.json();
       

            const Module = await createModule(); // Call the wrapper function to initialize WASM
            
            
            //Initialize WASM
            Module._init_students(list.length);
          
             list.map((student, index) => {
                
                const namePtr = Module._malloc(Module.lengthBytesUTF8(student.sname) + 1);
                 Module.stringToUTF8(student.sname, namePtr, Module.lengthBytesUTF8(student.sname) + 1);
                 Module._update_student(index, student.id, namePtr, student.marks);//insert data in address of the memory
                 Module._free(namePtr);
                
            });
            

            const processeddata=list.map((_,index)=>{
                const studentPtr=Module._get_student(index);
                
                
                
           

                return {
                    id: Module.HEAP32[studentPtr / 4],// each entry in heap32 represent 4 bytes of memory (if 0x0020 then 0x0024) to get the pointer position we devide to 4
                    sname: Module.UTF8ToString(studentPtr + 4), // Assuming offset of 4 for `sname`
                    marks: Module.HEAP32[(studentPtr + 56)/4], //54+2 padding byte 
                    
                  };
                });
            
       return processeddata
            
        } else {
                
                const text = await response.text()
                throw new TypeError(text)
              
            
        } 

    } catch (error) {
        
            console.log(error);
            return { error: error };
            
    }
    
}

async function getDuckDBStd() {

    const URL = BACKENDURL+"/dockDB"

    try {

        const response = await fetch(URL)
        const result = await response.json()
       
        
        return result
        
        
    } catch (error) {
        console.error('Error:', error);
    }
    
}




export { getStudent, getDuckDBStd};




