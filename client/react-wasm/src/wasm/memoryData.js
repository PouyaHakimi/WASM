import { da } from "@faker-js/faker";
import {fakeDataDuckDB, mainDataDuckDB, jsonDataDuckDB, jsonStreamDataDuckDB, jsonStreamStdMarkDataDuckDB ,jsonStdMarkDataDuckDB } from "../DuckDB";
import createModule from "../wasm/student2";
import createMainModule from "./mainstudents3"


//**************  Memory Data Json  ********* */
export async function memoryJsonData({query}) {
   
    const mainData = await jsonDataDuckDB({query})
    console.log("inn froooont publiiiiiicccc"+JSON.stringify(mainData));
    console.log(Array.isArray(mainData));
    

    const module = await createMainModule() // wraper Module that has created by makin import creatModule functional the name can be even asghar

    module._std_init(mainData.length)

    mainData.map(
        (student, index) => {

            const snamePtr = module._malloc(module.lengthBytesUTF8(student.sname) + 1)
            const cnamePtr = module._malloc(module.lengthBytesUTF8(student.cname) + 1)
            module.stringToUTF8(student.sname, snamePtr, module.lengthBytesUTF8(student.sname) + 1)
            module.stringToUTF8(student.cname, cnamePtr, module.lengthBytesUTF8(student.cname) + 1)
            module._insert_student(index, student.id, snamePtr, cnamePtr, student.marks)
            module._free(snamePtr)
            module._free(cnamePtr)
        }
    )


    const stdproceeddata = mainData.map((_, index) => {

        const stdpointer = module._get_student(index)

        const memoryData = {
            id: module.HEAP32[stdpointer / 4],
            sname: module.UTF8ToString(stdpointer + 4),
            cname: module.UTF8ToString((stdpointer + 54)),
            marks: module.HEAP32[(stdpointer + 104) / 4]

        }

        return memoryData
    })


    return stdproceeddata


}

export async function memoryJsonStreamData({query}) {
   
    
    const data = await jsonStreamDataDuckDB({query})
    
    const mainData = data.convertedBigIntResult 
    const module = await createMainModule() // wraper Module that has created by makin import creatModule functional the name can be even asghar

    module._std_init(mainData.length)

    mainData.map(
        (student, index) => {

            const snamePtr = module._malloc(module.lengthBytesUTF8(student.sname) + 1)
            const cnamePtr = module._malloc(module.lengthBytesUTF8(student.cname) + 1)
            module.stringToUTF8(student.sname, snamePtr, module.lengthBytesUTF8(student.sname) + 1)
            module.stringToUTF8(student.cname, cnamePtr, module.lengthBytesUTF8(student.cname) + 1)
            module._insert_student(index, student.id, snamePtr, cnamePtr, student.marks)
            module._free(snamePtr)
            module._free(cnamePtr)
        }
    )


    const stdproceeddata = mainData.map((_, index) => {

        const stdpointer = module._get_student(index)

        const memoryData = {
            id: module.HEAP32[stdpointer / 4],
            sname: module.UTF8ToString(stdpointer + 4),
            cname: module.UTF8ToString((stdpointer + 54)),
            marks: module.HEAP32[(stdpointer + 104) / 4]

        }

        return memoryData
    })


    return stdproceeddata


}

export async function memoryJsonStreamStdMarkData() {

   
    const mainData = await jsonStreamStdMarkDataDuckDB()
   
    const module = await createMainModule();
   
    module._fullMark_init(mainData.convertedBigIntFullMark.length)
    module._attended_init(mainData.convertedBigIntAttended.length)

    mainData.convertedBigIntFullMark.map((std, index) => {

        const fmCnamePtr = module._malloc(module.lengthBytesUTF8(std.course_name) + 1)
        module.stringToUTF8(std.course_name, fmCnamePtr, module.lengthBytesUTF8(std.course_name))
        module._insert_fullMark(index, fmCnamePtr, Number(std.student_count))
        module._free()
    })

    const proceedDataFm = mainData.convertedBigIntFullMark.map((_, index) => {
        const fullMarkPtr = module._get_fullMark(index)
       
        const memoryDataFm = {
            course_name: module.UTF8ToString(fullMarkPtr),
            student_count: module.HEAP32[(fullMarkPtr + 52) / 4]

        }

       

        return memoryDataFm


    })
    mainData.convertedBigIntAttended.map((std, index) => {
        const allAttendedPtr = module._malloc(module.lengthBytesUTF8(std.course_name) + 1)
        module.stringToUTF8(std.course_name, allAttendedPtr, module.lengthBytesUTF8(std.course_name) + 1)
        module._insert_attended(index, allAttendedPtr, Number(std.attended_students))
        module._free()

    })

    const proceedDataAt = mainData.convertedBigIntAttended.map((_, index) => {
        const AttendedPtr = module._get_attended(index)
        const memoryDataAt = {
            course_name: module.UTF8ToString(AttendedPtr),
            attended_students: module.HEAP32[(AttendedPtr+52)/4]
        }
        
        return memoryDataAt
    })
     
    const resultFm = JSON.stringify(proceedDataFm)
    const resultAt = JSON.stringify(proceedDataAt)

    
    return {
        resultFm,
        resultAt
    }

}

export async function memoryJsonStdMarkData() {

   
    const mainData = await jsonStdMarkDataDuckDB()
   
    const module = await createMainModule();
   
    module._fullMark_init(mainData.convertedBigIntFullMark.length)
    module._attended_init(mainData.convertedBigIntAttended.length)

    mainData.convertedBigIntFullMark.map((std, index) => {

        const fmCnamePtr = module._malloc(module.lengthBytesUTF8(std.course_name) + 1)
        module.stringToUTF8(std.course_name, fmCnamePtr, module.lengthBytesUTF8(std.course_name))
        module._insert_fullMark(index, fmCnamePtr, Number(std.student_count))
        module._free()
    })

    const proceedDataFm = mainData.convertedBigIntFullMark.map((_, index) => {
        const fullMarkPtr = module._get_fullMark(index)
       
        const memoryDataFm = {
            course_name: module.UTF8ToString(fullMarkPtr),
            student_count: module.HEAP32[(fullMarkPtr + 52) / 4]

        } 

        return memoryDataFm


    })
    mainData.convertedBigIntAttended.map((std, index) => {
        const allAttendedPtr = module._malloc(module.lengthBytesUTF8(std.course_name) + 1)
        module.stringToUTF8(std.course_name, allAttendedPtr, module.lengthBytesUTF8(std.course_name) + 1)
        module._insert_attended(index, allAttendedPtr, Number(std.attended_students))
        module._free()

    })

    const proceedDataAt = mainData.convertedBigIntAttended.map((_, index) => {
        const AttendedPtr = module._get_attended(index)
        const memoryDataAt = {
            course_name: module.UTF8ToString(AttendedPtr),
            attended_students: module.HEAP32[(AttendedPtr+52)/4]
        }
        
        return memoryDataAt
    })
     
    const resultFm = JSON.stringify(proceedDataFm)
    const resultAt = JSON.stringify(proceedDataAt)

    
    return {
        resultFm,
        resultAt
    }

}


/////////**************Memory Data DB */
export async function memoryStdCourseData({search}) {

    const mainData = await mainDataDuckDB({search})

    const module = await createMainModule() // wraper Module that has created by makin import creatModule functional the name can be even asghar

    module._std_init(mainData.dataArray.length)

    mainData.dataArray.map(
        (student, index) => {

            const snamePtr = module._malloc(module.lengthBytesUTF8(student.sname) + 1)
            const cnamePtr = module._malloc(module.lengthBytesUTF8(student.cname) + 1)
            module.stringToUTF8(student.sname, snamePtr, module.lengthBytesUTF8(student.sname) + 1)
            module.stringToUTF8(student.cname, cnamePtr, module.lengthBytesUTF8(student.cname) + 1)
            module._insert_student(index, student.id, snamePtr, cnamePtr, student.marks)
            module._free(snamePtr)
            module._free(cnamePtr)
        }
    )


    const stdproceeddata = mainData.dataArray.map((_, index) => {

        const stdpointer = module._get_student(index)

        const memoryData = {
            id: module.HEAP32[stdpointer / 4],
            sname: module.UTF8ToString(stdpointer + 4),
            cname: module.UTF8ToString((stdpointer + 54)),
            marks: module.HEAP32[(stdpointer + 104) / 4]

        }

      

        return memoryData
    })


    return stdproceeddata

}

export async function memoryStdMarkData({search}) {

    const mainData = await mainDataDuckDB({search})
   
    const module = await createMainModule();

    module._fullMark_init(mainData.fullMarksArray.length)
    module._attended_init(mainData.allAttendedArray.length)

    mainData.fullMarksArray.map((std, index) => {

        const fmCnamePtr = module._malloc(module.lengthBytesUTF8(std.course_name) + 1)
        module.stringToUTF8(std.course_name, fmCnamePtr, module.lengthBytesUTF8(std.course_name))
        module._insert_fullMark(index, fmCnamePtr, Number(std.student_count))
        module._free()
    })

    const proceedDataFm = mainData.fullMarksArray.map((_, index) => {
        const fullMarkPtr = module._get_fullMark(index)
       
        const memoryDataFm = {
            course_name: module.UTF8ToString(fullMarkPtr),
            student_count: module.HEAP32[(fullMarkPtr + 52) / 4]

        }

       

        return memoryDataFm


    })
    mainData.allAttendedArray.map((std, index) => {
        const allAttendedPtr = module._malloc(module.lengthBytesUTF8(std.course_name) + 1)
        module.stringToUTF8(std.course_name, allAttendedPtr, module.lengthBytesUTF8(std.course_name) + 1)
        module._insert_attended(index, allAttendedPtr, Number(std.attended_students))
        module._free()

    })

    const proceedDataAt = mainData.allAttendedArray.map((_, index) => {
        const AttendedPtr = module._get_attended(index)
        const memoryDataAt = {
            course_name: module.UTF8ToString(AttendedPtr),
            attended_students: module.HEAP32[(AttendedPtr+52)/4]
        }
        
        return memoryDataAt
    })
     
    const resultFm = JSON.stringify(proceedDataFm)
    const resultAt = JSON.stringify(proceedDataAt)

    
    return {
        resultFm,
        resultAt
    }

}



//***************Fake Data Table */

export async function memoryStdCourseFakeData() {

    const mainData = await fakeDataDuckDB()
    console.log(mainData+"fake dataaa table");

    const module = await createMainModule() // wraper Module that has created by makin import creatModule functional the name can be even asghar

    module._std_init(mainData.dataArray.length)
    module._fullMark_init(mainData.fullMarksArray.length)
    module._attended_init(mainData.allAttendedArray.length)

    mainData.dataArray.map(
        (student, index) => {

            const snamePtr = module._malloc(module.lengthBytesUTF8(student.sname) + 1)
            const cnamePtr = module._malloc(module.lengthBytesUTF8(student.cname) + 1)
            module.stringToUTF8(student.sname, snamePtr, module.lengthBytesUTF8(student.sname) + 1)
            module.stringToUTF8(student.cname, cnamePtr, module.lengthBytesUTF8(student.cname) + 1)
            module._insert_student(index, student.id, snamePtr, cnamePtr, student.marks)
            module._free(snamePtr)
            module._free(cnamePtr)
        }
    )

    mainData.fullMarksArray.map((std, index) => {

        const fmCnamePtr = module._malloc(module.lengthBytesUTF8(std.course_name) + 1)
        module.stringToUTF8(std.course_name, fmCnamePtr, module.lengthBytesUTF8(std.course_name))
        module._insert_fullMark(index, fmCnamePtr, Number(std.student_count))
        module._free()
    })

    mainData.allAttendedArray.map((std, index) => {
        const allAttendedPtr = module._malloc(module.lengthBytesUTF8(std.course_name) + 1)
        module.stringToUTF8(std.course_name, allAttendedPtr, module.lengthBytesUTF8(std.course_name) + 1)
        module._insert_attended(index, allAttendedPtr, Number(std.attended_students))
        module._free()

    })

    const stdproceeddata = mainData.dataArray.map((_, index) => {

        const stdpointer = module._get_student(index)

        const memoryData = {
            id: module.HEAP32[stdpointer / 4],
            sname: module.UTF8ToString(stdpointer + 4),
            cname: module.UTF8ToString((stdpointer + 54)),
            marks: module.HEAP32[(stdpointer + 104) / 4]

        }

      

        return memoryData
    })

    const proceedDataFm = mainData.fullMarksArray.map((_, index) => {
        const fullMarkPtr = module._get_fullMark(index)
       
        const memoryDataFm = {
            course_name: module.UTF8ToString(fullMarkPtr),
            student_count: module.HEAP32[(fullMarkPtr + 52) / 4]

        }

       

        return memoryDataFm


    })

    const proceedDataAt = mainData.allAttendedArray.map((_, index) => {
        const AttendedPtr = module._get_attended(index)
        const memoryDataAt = {
            course_name: module.UTF8ToString(AttendedPtr),
            attended_students: module.HEAP32[(AttendedPtr+52)/4]
        }
        
        return memoryDataAt
    })
    
    const resulstd =JSON.stringify(stdproceeddata)
    const resultFm = JSON.stringify(proceedDataFm)
    const resultAt = JSON.stringify(proceedDataAt)



    return {resulstd,resultFm,resultAt}

}



// //***************Fake Data Chart */
// export async function memoryStdDataFaker() {

//     const mainData = await fakeDataDuckDB()
//    console.log(mainData+"fake dataaa chart");
   
//     const module = await createMainModule();

//     module._fullMark_init(mainData.fullMarksArray.length)
//     module._attended_init(mainData.allAttendedArray.length)

//     mainData.fullMarksArray.map((std, index) => {

//         const fmCnamePtr = module._malloc(module.lengthBytesUTF8(std.course_name) + 1)
//         module.stringToUTF8(std.course_name, fmCnamePtr, module.lengthBytesUTF8(std.course_name))
//         module._insert_fullMark(index, fmCnamePtr, Number(std.student_count))
//         module._free()
//     })

//     const proceedDataFm = mainData.fullMarksArray.map((_, index) => {
//         const fullMarkPtr = module._get_fullMark(index)
       
//         const memoryDataFm = {
//             course_name: module.UTF8ToString(fullMarkPtr),
//             student_count: module.HEAP32[(fullMarkPtr + 52) / 4]

//         }

       

//         return memoryDataFm


//     })
//     mainData.allAttendedArray.map((std, index) => {
//         const allAttendedPtr = module._malloc(module.lengthBytesUTF8(std.course_name) + 1)
//         module.stringToUTF8(std.course_name, allAttendedPtr, module.lengthBytesUTF8(std.course_name) + 1)
//         module._insert_attended(index, allAttendedPtr, Number(std.attended_students))
//         module._free()

//     })

//     const proceedDataAt = mainData.allAttendedArray.map((_, index) => {
//         const AttendedPtr = module._get_attended(index)
//         const memoryDataAt = {
//             course_name: module.UTF8ToString(AttendedPtr),
//             attended_students: module.HEAP32[(AttendedPtr+52)/4]
//         }
        
//         return memoryDataAt
//     })
     
//     const resultFm = JSON.stringify(proceedDataFm)
//     const resultAt = JSON.stringify(proceedDataAt)

    
//     return {
//         resultFm,
//         resultAt
//     }




//}