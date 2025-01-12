import { defineStore } from 'pinia';

export const useClassStore = defineStore('classStore', {
    state: () => ({
        classes: JSON.parse(localStorage.getItem('classes')) || []
    }),
    actions: {
        addClass(classItem) {
            this.classes.push(classItem);
            this.updateLocalStorage();
        },
        removeClass(index) {
            this.classes.splice(index, 1);
            this.updateLocalStorage();
        },
        updateClass(index, classItem) {
            this.classes[index] = classItem;
            this.updateLocalStorage();
        },
        updateLocalStorage() {
            localStorage.setItem('classes', JSON.stringify(this.classes));
        },
        loadFromLocalStorage() {
            const storedClasses = JSON.parse(localStorage.getItem('classes'));
            if (storedClasses) {
                this.classes = storedClasses;
            }
        }
    },
});
