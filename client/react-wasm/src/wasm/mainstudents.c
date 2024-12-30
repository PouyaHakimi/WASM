#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct
{
    int id;
    char sname[50];
    char cname[50];
    int marks;
}Student;

typedef struct
{
    char fmcname[50];
    int fmCount;
}FullMark;

typedef struct
{
    char atCname[50];
    int atCount;
}Attended;

Student* students=NULL;
int num_students=0;

FullMark* fullMark =NULL;
int num_fullMark = 0;

Attended* attended=NULL;
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

void fullMark_init(int count){
    if (fullMark != NULL)
    {
        free(fullMark);
    }
    num_fullMark = count;
    fullMark = (FullMark*)malloc(count*sizeof(FullMark));

}

void attended_init(int count){
    if (attended != NULL)
    {
        free(attended);
    }
    num_attended = count;
    attended = (Attended*)malloc(count*sizeof(Attended));   
}


//******Insert Data */
void insert_student(int index ,int id, char* sname ,char* cname,int marks){
    if (index < 0 || index >= num_students) return;
    
    students[index].id = id;
    strncpy(students[index].sname,sname,50);
    strncpy(students[index].cname,cname,50);
    students[index].marks=marks;

}

void insert_fullMark(int index ,char* fmCname,int fmCount){
    strncpy(fullMark[index].fmcname,fmCname,50);
    fullMark[index].fmCount=fmCount;
}

void insert_attended(int index ,char* atcname,int atCount){
    strncpy(attended[index].atCname,atcname,50);
    attended[index].atCount=atCount;
}

//*****Retrieve Data */
Student* get_student(int index){
    if (index < 0 || index >= num_students) return NULL;
    return &students[index];
}

FullMark* get_fullMark(int index){
    if( index < 0 || index >= num_fullMark) return NULL;
    return &fullMark[index];
}
Attended* get_attended(int index){
    if( index < 0 || index >= num_attended) return NULL;
    return &attended[index];
}

//*****Free Memory */
void free_std(){
    free(students);
    students = NULL;
}

void free_fullMark(){
    free(fullMark);
    fullMark = NULL;
}

void free_attended(){
    free(attended);
    attended = NULL;
}