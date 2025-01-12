<template>
  <div class="p-6">
    <!-- Розклад -->
    <div class="overflow-x-auto">
      <table class="table-auto border-collapse border border-gray-300 w-full">
        <thead>
        <tr>
          <!-- Порожня клітинка для осі днів -->
          <th class="border border-gray-300 p-2 bg-gray-100"></th>
          <!-- Заголовки для класів -->
          <th
              v-for="(className, classIndex) in classes"
              :key="classIndex"
              class="border border-gray-300 p-2 bg-gray-100 text-center"
          >
            {{ className }}
          </th>
        </tr>
        </thead>
        <tbody>
        <!-- Рядки для днів тижня -->
        <tr v-for="(day, dayIndex) in days" :key="dayIndex">
          <!-- Назва дня -->
          <td class="border border-gray-300 p-2 bg-gray-50 font-semibold">
            {{ day }}
          </td>
          <!-- Уроки для кожного класу -->
          <td
              v-for="(classSchedule, classIndex) in schedules"
              :key="classIndex"
              class="border border-gray-300 p-2"
          >
            <ul class="space-y-2">
              <li
                  v-for="(lesson, lessonIndex) in classSchedule[dayIndex]"
                  :key="lessonIndex"
                  class="flex items-center space-x-2 p-2 border rounded-lg bg-gray-100 shadow-sm cursor-pointer"
                  :class="{ 'bg-gray-300': lesson.frozen }"
                  draggable="true"
                  @dragstart="onDragStart($event, dayIndex, classIndex, lessonIndex)"
                  @dragover.prevent
                  @drop="onDrop($event, dayIndex, classIndex, lessonIndex)"
              >
                  <span
                      class="flex-1 text-sm"
                      v-if="lesson.name"
                  >
                    {{ lesson.name }}
                  </span>
                <span
                    v-else
                    class="flex-1 text-sm text-gray-400 italic"
                >
                    Порожній слот
                  </span>
                <button
                    class="text-xs text-blue-500 hover:underline"
                    @click="toggleFrozen(dayIndex, classIndex, lessonIndex)"
                >
                  {{ lesson.frozen ? 'Розморозити' : 'Заморозити' }}
                </button>
              </li>
            </ul>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Назви класів
      classes: Array.from({ length: 11 }).map((_, i) => `Клас ${i + 1}`),
      // Назви днів
      days: ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця"],
      // Розклад: 7 слотів для кожного дня
      schedules: Array.from({ length: 11 }).map(() =>
          Array.from({ length: 5 }).map(() =>
              Array.from({ length: 7 }).map(() => ({
                name: "", // Назва уроку, порожній для пустих слотів
                frozen: false, // Заморожений чи ні
              }))
          )
      ),
      // Зберігає інформацію про перетягуваний елемент
      draggedLesson: null,
    };
  },
  methods: {
    // Початок перетягування
    onDragStart(event, dayIndex, classIndex, lessonIndex) {
      this.draggedLesson = { dayIndex, classIndex, lessonIndex };
    },
    // Закінчення перетягування
    onDrop(event, dayIndex, classIndex, lessonIndex) {
      if (!this.draggedLesson) return;

      const { dayIndex: fromDay, classIndex: fromClass, lessonIndex: fromLesson } =
          this.draggedLesson;

      const fromLessonData = this.schedules[fromClass][fromDay][fromLesson];
      const toLessonData = this.schedules[classIndex][dayIndex][lessonIndex];

      if (toLessonData.frozen) {
        alert("Неможливо перемістити в заморожений слот!");
        return;
      }

      // Переміщення уроку
      this.schedules[fromClass][fromDay][fromLesson] = toLessonData;
      this.schedules[classIndex][dayIndex][lessonIndex] = fromLessonData;

      this.draggedLesson = null;
    },
    // Заморожування/розморожування уроку
    toggleFrozen(dayIndex, classIndex, lessonIndex) {
      const lesson = this.schedules[classIndex][dayIndex][lessonIndex];
      lesson.frozen = !lesson.frozen;
    },
  },
};
</script>

<style>
/* Додатковий стиль для кращої видимості */
</style>
