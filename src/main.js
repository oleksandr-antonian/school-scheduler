import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { createWebHashHistory, createRouter } from 'vue-router'
import './style.css'
import 'primeicons/primeicons.css'

import App from './App.vue'
import PrimeVue from 'primevue/config';
import ThemePreset from './theme.js';
import ConfirmationService from 'primevue/confirmationservice'
import Button from "primevue/button"
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import ConfirmPopup from 'primevue/confirmpopup';
import HomeView from './views/HomeView.vue';
import TeacherListView from './views/TeacherListView.vue';
import ClassListView from './views/ClassListView.vue';
import SubjectListView from './views/SubjectListView.vue';

const app = createApp(App);
const pinia = createPinia();

const routes = [
    { path: '/', component: HomeView, name: 'Home' },
    { path: '/teachers', component: TeacherListView, name: 'Teachers' },
    { path: "/classes", component: ClassListView, name: 'Classes' },
    { path: "/subjects", component: SubjectListView, name: 'Subjects' }
]

const router = createRouter({
    history: createWebHashHistory(),
    base: '/school-scheduler/',
    routes,
})

app.use(router);
app.use(pinia);
app.use(PrimeVue, {
    theme: {
        preset: ThemePreset,
        options: {
            darkModeSelector: '.dark-mode',
        }
    }
});
app.use(ConfirmationService);


app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('InputText', InputText);
app.component('ConfirmPopup', ConfirmPopup);
app.component('InputNumber', InputNumber);
app.component('Select', Select);

app.mount('#app')
