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

Student* students=NULL;
int num_students=0;


void std_init(int count){

    if (students!=NULL)
    {
        free(students);
    }
    num_students = count;
    students =(Student*)malloc(count*sizeof(Student));
}

void insert_student(int index ,int id, char* sname ,char* cname,int marks){
    if (index < 0 || index >= num_students) return;
    
    students[index].id = id;
    strncpy(students[index].sname,sname,50);
    strncpy(students[index].cname,cname,50);
    students[index].marks=marks;

}
Student* get_student(int index){
    if (index < 0 || index >= num_students) return NULL;
    return &students[index];
}

void free_memory(){
    free(students);
    students = NULL;
}