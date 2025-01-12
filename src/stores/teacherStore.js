import { defineStore } from 'pinia';

export const useTeacherStore = defineStore('teacherStore', {
    state: () => ({
        teachers: JSON.parse(localStorage.getItem('teachers')) || [],
    }),
    actions: {
        addTeacher(teacher) {
            this.teachers.push(teacher);
            this.updateLocalStorage();
        },
        removeTeacher(index) {
            this.teachers.splice(index, 1);
            this.updateLocalStorage();
        },
        updateTeacher(index, teacher) {
            this.teachers[index] = teacher;
            this.updateLocalStorage();
        },
        updateLocalStorage() {
            localStorage.setItem('teachers', JSON.stringify(this.teachers));
        },
        loadFromLocalStorage() {
            const storedTeachers = JSON.parse(localStorage.getItem('teachers'));
            if (storedTeachers) {
                this.teachers = storedTeachers;
            }
        },
    },
});
