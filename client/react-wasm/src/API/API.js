import createModule from "../wasm/student2";



const BACKENDURL = 'http://localhost:3001/api'

async function getStudent() {
    const URL =BACKENDURL+'/users';

    try {
        
        const response = await fetch(URL);
   
        
        if (response.ok) {

            const list= await response.json();
       

            const Module = await createModule(); // Call the wrapper function to initialize WASM
            console.log(Module);
            
            //Initialize WASM
            Module._init_students(list.length);
            

            
            list.forEach((student,index)=>{
                
                
                const namePtr = Module._malloc(Module.lengthBytesUTF8(student.sname) + 1)
                Module.stringToUTF8(student.sname, namePtr, Module.lengthBytesUTF8(student.sname) + 1);
                Module._update_student(index, student.id, namePtr, student.marks);
                Module._free(namePtr);
                
            })

            const processeddata=list.map((_,index)=>{
                const studentPtr=Module._get_student(index);
           

                return {
                    id: Module.HEAP32[studentPtr / 4],
                    sname: Module.UTF8ToString(studentPtr + 4), // Assuming offset of 4 for `sname`
                    marks: Module.HEAP32[(studentPtr + 54) / 4], // Assuming offset for `marks`
                    
                  };
                });
            
            console.log("+++++"+processeddata);
            


            
       return processeddata
            
        } else {
                console.log(response.statusText);
                const text = await response.text()
                throw new TypeError(text)
              
            
        } 

    } catch (error) {
        
            console.log(error);
            return { error: error };
            
    }
    
}

export default getStudent;