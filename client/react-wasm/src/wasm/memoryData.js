import {mainDataDuckDB, studentDuckDB} from "../DuckDB";
import createModule from "../wasm/student2";
import createMainModule from "./mainstudents"

export async function memoryStudentData(props) {

    const DuckData = await studentDuckDB()
   
    console.log(DuckData+"heeeereeee");
    
    
    const module = await createModule() // wraper Module that has created by makin import creatModule functional the name can be even asghar

    module._init_students(DuckData.length)

    DuckData.map(
        (student,index)=>{
            const namePtr = module._malloc(module.lengthBytesUTF8(student.sname)+1)
            console.log(namePtr+")))))))");
            module.stringToUTF8(student.sname,namePtr,module.lengthBytesUTF8(student.sname)+1)
            module._update_student(index,student.id,namePtr,student.age)
            module._free()
        }   
    )


    const stdproceeddata= DuckData.map((_,index)=>{
        console.log(index+"test1111111");
        const stdpointer = module._get_student(index)
        
        
        const memoryData={
            id: module.HEAP32[stdpointer /4],
            sname: module.UTF8ToString(stdpointer+4),
            age: module.HEAP32[(stdpointer+56)/4]

        }

        return memoryData
    })
    
    
    return stdproceeddata
    
}

export async function memoryStdCourseData(props) {

    const mainData = await mainDataDuckDB()
     //const mainData = await mainDataDuckDB();
     console.log("****"+mainData.dataArray);
     console.log("****"+mainData.fullMarksArray);
     console.log("****"+mainData.allAttendedArray);

  console.log(mainData.dataArray+"heereeeee2");
  
    const module = await createMainModule() // wraper Module that has created by makin import creatModule functional the name can be even asghar

    module._std_init(mainData.dataArray.length)

    
    mainData.dataArray.map(
        (student,index)=>{
            console.log(student+"11111");
            
            console.log(student.id +"*******"+student.sname)
            
            const snamePtr = module._malloc(module.lengthBytesUTF8(student.sname)+1)
            
            const cnamePtr = module._malloc(module.lengthBytesUTF8(student.cname)+1)
            module.stringToUTF8(student.sname,snamePtr,module.lengthBytesUTF8(student.sname)+1)
            module.stringToUTF8(student.cname,cnamePtr,module.lengthBytesUTF8(student.cname)+1)
            module._insert_student(index,student.id,snamePtr,cnamePtr,student.marks)
            module._free(snamePtr)
            module._free(cnamePtr)
        }   
    )


    const stdproceeddata= mainData.dataArray.map((_,index)=>{
        
        const stdpointer = module._get_student(index)
        
        const memoryData={
            id: module.HEAP32[stdpointer /4],
            sname: module.UTF8ToString(stdpointer+4),
            cname: module.UTF8ToString((stdpointer+54)),
            marks: module.HEAP32[(stdpointer+104)/4]

        }

        console.log(JSON.stringify(memoryData)+"in memory");
        
        return memoryData
    })
    
    
    return stdproceeddata
    
}