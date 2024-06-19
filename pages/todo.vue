<template>
  <div class="container d-flex flex-column justify-content-center align-items-center min-vh-100">
    <header class="text-center text-light my-4">
      <h1 class="mb-4">Todo List</h1>
      <form class="search" @submit.prevent>
        <input
          v-model="search"
          class="form-control m-auto rounded-pill"
          type="text"
          name="search"
          placeholder="Search todos"
        />
      </form>
    </header>

    <ul class="list-group todos mx-auto text-light">
      <li
        v-for="(todo, id) in filteredTodos"
        :key="id"
        class="list-group-item d-flex justify-content-between align-items-center rounded-pill mb-2"
      >
        <span>{{ todo.courseName }}</span>
        <ul>
          <li v-for="(time, index) in todo.courseTimes" :key="index">
            {{ translateCourseTime(time) }}
          </li>
        </ul>
        <i class="far fa-trash-alt delete" @click="deleteTodo(id)"></i>
      </li>
    </ul>

    <form class="add text-center my-4" @submit.prevent="addTodo">
      <label class="text-light mb-2">Add a new course...</label>
      <input v-model="newCourseName" class="form-control m-auto rounded-pill" type="text" name="add" placeholder="Nama Mata Kuliah" />
      <div v-for="(timeSlot, index) in newCourseTimeSlots" :key="index">
        <input v-model="newCourseTimeSlots[index]" class="form-control m-auto rounded-pill" type="text" placeholder="Kode Jam (a-l)" />
        <button @click="removeTimeSlot(index)">Hapus Slot</button>
      </div>
      <button @click="addTimeSlot">Tambah Slot Waktu</button>
      <br />
      <div class="text-center mt-2">
        <input type="submit" class="btn btn-light rounded-pill" value="Add Course" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref as dbRef, child, set, remove, onValue } from 'firebase/database';

const newCourseName = ref('');
const newCourseTimeSlots = ref<string[]>(['']);
const courses = ref<Record<string, any>>({});
const search = ref('');

const auth = getAuth();
const database = getDatabase();
const user = auth.currentUser;

const loadCourses = () => {
  if (user) {
    const userCoursesRef = dbRef(database, `users/${user.uid}/courses`);
    onValue(userCoursesRef, (snapshot) => {
      courses.value = snapshot.val() || {};
    });
  }
};

const addTodo = () => {
  if (user && newCourseName.value && newCourseTimeSlots.value.length > 0) {
    const translatedTimes = newCourseTimeSlots.value.map(time => translateCourseTime(time));
    const invalidTime = translatedTimes.includes('Waktu tidak valid');
    if (invalidTime) {
      alert('Kode jam tidak valid. Gunakan kode dari a sampai l.');
      return;
    }

    const userCoursesRef = dbRef(database, `users/${user.uid}/courses`);
    const newCourseKey = child(userCoursesRef, 'new').key;
    if (newCourseKey) {
      const newCourseRef = child(userCoursesRef, newCourseKey);
      set(newCourseRef, {
        courseName: newCourseName.value,
        courseTimes: newCourseTimeSlots.value
      }).then(() => {
        loadCourses(); // Load courses again to ensure new course is shown
        newCourseName.value = '';
        newCourseTimeSlots.value = [''];
      });
    }
  }
};

const addTimeSlot = () => {
  newCourseTimeSlots.value.push('');
};

const removeTimeSlot = (index: number) => {
  if (newCourseTimeSlots.value.length > 1) {
    newCourseTimeSlots.value.splice(index, 1);
  } else {
    alert('Anda harus memiliki setidaknya satu slot waktu.');
  }
};

const deleteTodo = (id: string) => {
  if (user) {
    const courseRef = dbRef(database, `users/${user.uid}/courses/${id}`);
    remove(courseRef).then(loadCourses);
  }
};

const translateCourseTime = (timeCode: string): string => {
  const timeMap: Record<string, string> = {
    'a': '07:30 - 08:20',
    'b': '08:30 - 09:20',
    'c': '09:30 - 10:20',
    'd': '10:30 - 11:20',
    'e': '11:30 - 12:20',
    'f': '12:30 - 13:20',
    'g': '13:30 - 14:20',
    'h': '14:30 - 15:20',
    'i': '15:30 - 16:20',
    'j': '16:30 - 17:20',
    'k': '17:30 - 18:20',
    'l': '18:30 - 19:20'
  };
  return timeMap[timeCode.toLowerCase()] || 'Waktu tidak valid';
};

const filteredTodos = computed(() => {
  const term = search.value.toLowerCase();
  return Object.entries(courses.value)
    .map(([id, course]) => ({ id, ...course }))
    .filter(course => course.courseName.toLowerCase().includes(term));
});

onMounted(loadCourses);
</script>

<style scoped>
body {
  background: #352f5b;
  font-family: "Josefin Sans", sans-serif;
  font-size: 23px;
}

.container {
  max-width: 400px;
}

input[type="text"],
input[type="text"]:focus {
  color: #fff;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  max-width: 400px;
  padding: 10px 20px;
}

.todos li {
  background: #423a6f;
  color: #fff;
  padding: 10px 20px;
}

.delete {
  cursor: pointer;
}

.filtered {
  display: none !important;
}

.btn:hover {
  background: #423a6f;
  color: #fff;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-radius: 13px 13px;
  transition: 0.3s;
}

.btn {
  padding: 10px 20px;
}

.add input[type="text"] {
  padding: 10px 20px;
}
</style>
