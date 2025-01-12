import { defineStore } from 'pinia';
import { useClassStore } from './classStore.js';
import { useSubjectStore } from './subjectStore.js';
import { useTeacherStore } from './teacherStore.js';
import { v4 as uuidv4 } from 'uuid';

export const useLessonStore = defineStore('lessonStore', {
    state: () => ({
        lessons: JSON.parse(localStorage.getItem('lessons')) || [],
    }),

    actions: {
        // Генерация уроков на основе предметов
        generateLessons() {
            const classStore = useClassStore();
            const subjectStore = useSubjectStore();
            const teacherStore = useTeacherStore();
            const lessons = this.lessons;
            const classes = classStore.classes;
            const subjects = subjectStore.subjects;
            const teachers = teacherStore.teachers;
            const MAX_DAYS = 5;
            const MAX_LESSONS = 7;

            // Перебираем классы
            classes.forEach(classItem => {
                const classSubjects = subjects.filter(subject => subject.classId === classItem.id);
                if (classSubjects.length === 0) {
                    return;
                }
                const lessonsPerWeek = classSubjects.map(subject => subject.lessonsPerWeek).reduce((a, b) => a + b, 0);
                const maxLessonsOfTheDay = Math.ceil(lessonsPerWeek / MAX_DAYS);
                classSubjects.forEach(subject => {
                    const teacher = teachers.find(teacher => teacher.id === subject.teacherId);
                    const lessonsCount = subject.lessonsPerWeek;
                    const lessonsPerDay = Math.ceil(lessonsCount / MAX_DAYS);
                    const lessonsAlreadyPlaced = lessons.filter(lesson => lesson.subjectId === subject.id).length;
                    if (lessonsAlreadyPlaced === lessonsCount) {
                        return;
                    }
                    for (let day = 0; day < MAX_DAYS; day++) {
                        const lessonsAlreadyPlaced = lessons.filter(lesson => lesson.subjectId === subject.id).length;
                        const lessonsToPlace = lessonsCount - lessonsAlreadyPlaced;
                        if (lessonsToPlace <= 0) {
                            break;
                        }
                        for (let lessonNumber = 0; lessonNumber < MAX_LESSONS; lessonNumber++) {
                            const lessonsAlreadyPlacedToday = lessons.filter(lesson => lesson.subjectId === subject.id && lesson.day === day).length;
                            if (lessonsAlreadyPlacedToday === lessonsPerDay) {
                                continue;
                            }
                            const classAlreadyHasLesson = lessons.some(lesson => lesson.classId === classItem.id && lesson.day === day && lesson.lessonNumber === lessonNumber);
                            if (classAlreadyHasLesson) {
                                continue;
                            }
                            const teacherAlreadyHasLesson = lessons.some(lesson => lesson.teacherId === teacher.id && lesson.day === day && lesson.lessonNumber === lessonNumber);
                            if (teacherAlreadyHasLesson) {
                                continue;
                            }
                            lessons.push({
                                id: uuidv4(),
                                classId: classItem.id,
                                subjectId: subject.id,
                                teacherId: teacher.id,
                                day,
                                lessonNumber,
                            });
                        }
                    }
                });
            });
            this.lessons = lessons;
            this.updateLocalStorage();
        },

        deleteLessons() {
            this.lessons = [];
            this.updateLocalStorage();
        },

        updateLesson(lesson, data) {
            const newLesson = {
                ...lesson,
                ...data,
            };
            const alreadyExists = this.lessons.find(item => item.day === newLesson.day && item.lessonNumber === newLesson.lessonNumber && item.classId === newLesson.classId);
            if (alreadyExists) {
                const newAlreadyLesson = {
                    ...alreadyExists,
                    day: lesson.day,
                    lessonNumber: lesson.lessonNumber,
                }
                this.lessons = this.lessons.map(item => item.id === alreadyExists.id ? newAlreadyLesson : item);
            }
            this.lessons = this.lessons.map(item => item.id === lesson.id ? newLesson : item);
            this.updateLocalStorage();
        },

        removeLesson(index) {
            this.lessons.splice(index, 1);
            this.updateLocalStorage();
        },

        updateLocalStorage() {
            localStorage.setItem('lessons', JSON.stringify(this.lessons));
        },

        loadFromLocalStorage() {
            const storedLessons = JSON.parse(localStorage.getItem('lessons'));
            if (storedLessons) {
                this.lessons = storedLessons;
            }
        },
    },
});
