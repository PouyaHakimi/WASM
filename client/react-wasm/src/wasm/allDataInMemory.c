#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct
{
    int id;
    char sname[50];
    int age;
}Student;

typedef struct 
{
    int cid;
    char cname[50];
    int credits;
}Courses;

typedef struct 
{
    int sid;
    int cid;
    int marks;
    int id ;
    
}Marks;

Student* students=NULL;
int num_students=0;

Courses* courses =NULL;
int num_fullMark = 0;

Marks* marks=NULL;
int num_attended;



//**********Initialization */
void std_init(int count){

    if (students!=NULL)
    {
        free(students);
    }
    num_students = count;
    students =(Student*)malloc(count*sizeof(Student));
}


void courses_init(int count){
    if (courses != NULL)
    {
        free(courses);
    }
    num_attended = count;
    courses = (Courses*)malloc(count*sizeof(Courses));   
}
void marks_init(int count){
    if (marks != NULL)
    {
        free(marks);
    }
    num_fullMark = count;
    marks = (Marks*)malloc(count*sizeof(Marks));

}


//******Insert Data */
void insert_student(int index ,int id, char* sname,int age){
    if (index < 0 || index >= num_students) return;
    
    students[index].id = id;
    strncpy(students[index].sname,sname,50);
    students[index].age=age;

}


void insert_courses(int index ,int cid ,char* cname,int credits){
    courses[index].cid=cid;
    strncpy(courses[index].cname,cname,50);
    courses[index].credits=credits;
}

void insert_marks(int index ,int sid , int cid ,int mark , int id){
    marks[index].sid=sid;
    marks[index].cid=cid;
    marks[index].marks=mark;
    marks[index].id=id;

}

//*****Retrieve Data */
Student* get_students(int index){
    if (index < 0 || index >= num_students) return NULL;
    return &students[index];
}

Courses* get_courses(int index){
    if( index < 0 || index >= num_attended) return NULL;
    return &courses[index];
}

Marks* get_marks(int index){
    if( index < 0 || index >= num_fullMark) return NULL;
    return &marks[index];
}

//*****Free Memory */
void free_students(){
    free(students);
    students = NULL;
}

void free_courses(){
    free(courses);
    courses = NULL;
}
void free_marks(){
    free(marks);
    marks = NULL;
}

