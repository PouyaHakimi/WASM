import { allPagedJsonFile } from "../API/API";
import createMainModule from "./mainstudents5"

export async function memoryAllJsonData({ query }) {

    let students
    let courses
    let marks

         await allPagedJsonFile({ query })
        .then(async data => {
            students = data.students.filter(student => student.id >= 1 && student.id <= 6000000)
            courses = data.courses
            marks = data.marks.filter(mark => mark.sid >= 1 && mark.sid <= 6000000) 

        })
   


    const module = await createMainModule() // wraper Module that has created by makin import creatModule functional the name can be even asghar

    module._std_init(students.length)

    students.map(
        (student, index) => {
            const snamePtr = module._malloc(module.lengthBytesUTF8(student.sname) + 1)
            module.stringToUTF8(student.sname, snamePtr, module.lengthBytesUTF8(student.sname) + 1)
            module._insert_student(index, student.id, snamePtr, student.age)
            module._free(snamePtr)
        }
    )


    const stdproceeddata = students.map((_, index) => {

        const stdpointer = module._get_students(index)

        const stdMemoryData = {
            id: module.HEAP32[stdpointer / 4],
            sname: module.UTF8ToString(stdpointer + 4),
            age: module.HEAP32[(stdpointer + 56) / 4]

        }

        return stdMemoryData
    })


//*********courses In Memory */



module._courses_init(courses.length)

courses.map(
    (course, index) => {

        const cnamePtr = module._malloc(module.lengthBytesUTF8(course.cname) + 1)
        module.stringToUTF8(course.cname, cnamePtr, module.lengthBytesUTF8(course.cname) + 1)
        module._insert_courses(index, course.cid, cnamePtr, course.credits)
        module._free(cnamePtr)
    }
)


const crsProceeddata = courses.map((_, index) => {

    const crspointer = module._get_courses(index)

    const crsMemoryData = {
        cid: module.HEAP32[crspointer / 4],
        cname: module.UTF8ToString(crspointer + 4),
        credits: module.HEAP32[(crspointer + 56) / 4]

    }

    return crsMemoryData
})

//********** Marks In Memory */



module._marks_init(marks.length)

marks.map(
    (mark, index) => {
        
        module._insert_marks(index, mark.sid, mark.cid, mark.marks,mark.id)
        
    }
)


const mrkProceeddata = marks.map((_, index) => {

    const mrkpointer = module._get_marks(index)

    const mrkMemoryData = {

        sid: module.HEAP32[mrkpointer / 4],
        cid: module.HEAP32[(mrkpointer + 4)/4],
        marks: module.HEAP32[(mrkpointer + 8) / 4],
        id:module.HEAP32[(mrkpointer+12)/4]

    }

    return mrkMemoryData
})

console.log("*********************************");
    console.log(stdproceeddata);
    console.log(crsProceeddata);
    console.log(mrkProceeddata);

    return {stdproceeddata,crsProceeddata,mrkProceeddata}


}