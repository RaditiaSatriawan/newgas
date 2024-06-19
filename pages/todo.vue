<template>
  <div class="todo-container">
    <div class="header">
      <h1>My Schedule</h1>
    </div>
    <div class="form-container">
      <form @submit.prevent="addCourse">
        <div class="form-group">
          <input v-model="courseName" type="text" placeholder="Course Name" required>
        </div>
        <div class="form-group">
          <select v-model="courseTime" required>
            <option value="" disabled>Select Time Slot</option>
            <option value="A">7:30-8:20</option>
            <option value="B">8:30-9:20</option>
            <option value="C">9:30-10:20</option>
            <option value="D">10:30-11:20</option>
            <option value="E">11:30-12:20</option>
            <option value="F">12:30-13:20</option>
            <option value="G">13:30-14:20</option>
            <option value="H">14:30-15:20</option>
            <option value="I">15:30-16:20</option>
            <option value="J">16:30-17:20</option>
            <option value="K">17:30-18:20</option>
            <option value="L">18:30-19:20</option>
          </select>
        </div>
        <button type="submit">Add Course</button>
      </form>
    </div>
    <div class="schedule-list">
      <h2>Weekly Schedule</h2>
      <ul>
        <li v-for="course in courses" :key="course.id">
          {{ course.name }} - {{ getTimeSlot(course.time) }}
          <button class="remove-btn" @click="removeCourse(course.id)">Remove</button>
        </li>
      </ul>
    </div>
    <div class="footer">
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';

const courseName = ref('');
const courseTime = ref('');
const courses = ref([]);

const { $firebase } = useNuxtApp();
const router = useRouter();

const userId = $firebase.auth.currentUser?.uid;

const fetchCourses = async () => {
  if (userId) {
    const snapshot = await $firebase.database.ref('courses/' + userId).once('value');
    if (snapshot.exists()) {
      courses.value = Object.entries(snapshot.val()).map(([id, course]) => ({ id, ...course }));
    }
  }
};

const addCourse = async () => {
  if (userId) {
    const newCourseRef = $firebase.database.ref('courses/' + userId).push();
    await newCourseRef.set({
      name: courseName.value,
      time: courseTime.value,
    });

    courses.value.push({
      id: newCourseRef.key,
      name: courseName.value,
      time: courseTime.value,
    });

    courseName.value = '';
    courseTime.value = '';
  }
};

const removeCourse = async (courseId: string) => {
  if (userId) {
    await $firebase.database.ref('courses/' + userId + '/' + courseId).remove();
    courses.value = courses.value.filter(course => course.id !== courseId);
  }
};

const getTimeSlot = (timeCode: string) => {
  const timeSlots: { [key: string]: string } = {
    A: '7:30-8:20',
    B: '8:30-9:20',
    C: '9:30-10:20',
    D: '10:30-11:20',
    E: '11:30-12:20',
    F: '12:30-13:20',
    G: '13:30-14:20',
    H: '14:30-15:20',
    I: '15:30-16:20',
    J: '16:30-17:20',
    K: '17:30-18:20',
    L: '18:30-19:20',
  };
  return timeSlots[timeCode] || 'Unknown time';
};

const logout = async () => {
  await $firebase.auth.signOut();
  router.push('/');
};

onMounted(fetchCourses);
</script>

<style scoped>
.todo-container {
  padding: 20px;
  background-color: #EFE4D2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #352F5D;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

h1, h2 {
  color: #352F5D;
}

.form-container {
  margin: 20px auto;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background: #352F5D;
  color: #EFE4D2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #352F5D;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #2380BD;
  color: #EFE4D2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1B6A99;
}

.schedule-list {
  margin: 20px auto;
  width: 100%;
  max-width: 600px;
}

.schedule-list ul {
  list-style-type: none;
  padding: 0;
}

.schedule-list li {
  display: flex;
  justify-content: space-between;
  padding: 50px;
  background: #352F5D;
  margin-bottom: 10px;
  color: #EFE4D2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.schedule-list .remove-btn {
  background-color: #dc3545;
  color: #EFE4D2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px 10px;
  margin-left: 100px;
}

.schedule-list .remove-btn:hover {
  background-color: #c82333;
}

.footer {
  text-align: center;
  margin-top: 20px;
}

.logout-btn {
  background-color: #2380BD;
  color: #EFE4D2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 10px 20px;
  width: 30%;
}

.logout-btn:hover {
  background-color: #1B6A99;
}
</style>
