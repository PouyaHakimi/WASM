import DuckDB from "../DuckDB";
import createModule from "../wasm/student2";

async function memoryData(props) {

    const DuckData = await DuckDB()
    
    const module = await createModule() // wraper Module that has created by makin import creatModule functional the name can be even asghar

    module._init_students(DuckData.length)

    DuckData.map(
        (student,index)=>{
            const namePtr = module._malloc(module.lengthBytesUTF8(student.sname)+1)
            module.stringToUTF8(student.sname,namePtr,module.lengthBytesUTF8(student.sname)+1)
            module._update_student(index,student.id,namePtr,student.marks)
            module._free()
        }   
    )


    const proceeddata= DuckData.map((_,index)=>{
        const stdpointer = module._get_student(index)
        const memoryData={
            id: module.HEAP32[stdpointer /4],
            sname: module.UTF8ToString(stdpointer+4),
            marks: module.HEAP32[(stdpointer+56)/4]

        }

        return memoryData
    })
    
    
    return proceeddata
    
}

export default memoryData;