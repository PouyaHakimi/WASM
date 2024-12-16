#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int id;
    char sname[50];
    int age;
} Student;

Student* students = NULL;
int num_students = 0;

// Function to initialize the students array with a given count
void init_students(int count) {
    // Free existing memory if necessary
    if (students != NULL) {
        free(students);
    }

    num_students = count;
    students = (Student*)malloc(count * sizeof(Student));
}

// Function to update a specific student at a given index
void update_student(int index, int id, const char* sname, int age) {
    if (index < 0 || index >= num_students) return;
    students[index].id = id;
    strncpy(students[index].sname, sname, 50);
    students[index].age = age;
}

// Function to get a student by index
Student* get_student(int index) {
    if (index < 0 || index >= num_students) return NULL;
    return &students[index];
}

// Function to free the allocated memory
void free_memory() {
    free(students);
    students = NULL;
}
