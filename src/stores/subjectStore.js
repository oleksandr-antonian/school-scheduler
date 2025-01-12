import { defineStore } from 'pinia';

export const useSubjectStore = defineStore('subjectStore', {
    state: () => ({
        subjects: JSON.parse(localStorage.getItem('subjects')) || [],
    }),
    actions: {
        addSubject(subject) {
            this.subjects.push(subject);
            this.updateLocalStorage();
        },
        removeSubject(index) {
            this.subjects.splice(index, 1);
            this.updateLocalStorage();
        },
        updateSubject(index, subject) {
            this.subjects[index] = subject;
            this.updateLocalStorage();
        },
        updateLocalStorage() {
            localStorage.setItem('subjects', JSON.stringify(this.subjects));
        },
        loadFromLocalStorage() {
            const storedSubjects = JSON.parse(localStorage.getItem('subjects'));
            if (storedSubjects) {
                this.subjects = storedSubjects;
            }
        },
    },
});
