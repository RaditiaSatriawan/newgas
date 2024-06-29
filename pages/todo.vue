<template>
  <div class="todo-container">
    <div class="header">
      <p class="greeting">{{ greetingMessage }}</p>
      <h1>My Schedule</h1>
    </div>
    <div class="form-container">
      <form @submit.prevent="addCourse" v-if="userId">
        <div class="form-group">
          <input v-model="courseName" type="text" placeholder="Course Name" required>
        </div>
        <div class="form-group">
          <select v-model="courseDay" required>
            <option value="" disabled>Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
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
      <p v-else>Please wait while loading...</p>
    </div>
    <div class="schedule-list">
      <h2>Weekly Schedule</h2>
      <ul v-if="userId && courses.length > 0">
        <li v-for="course in courses" :key="course.id">
          <div class="course-info">
            <span>{{ course.name }}</span> |
            <span>{{ course.day }}</span> |
            <span>{{ getTimeSlot(course.time) }}</span>
          </div>
          <button class="remove-btn" @click="removeCourse(course.id)">Remove</button>
        </li>
      </ul>
      <p v-else-if="userId && courses.length === 0">No courses added yet.</p>
      <p v-else>Please log in to view your schedule.</p>
    </div>
    <div class="footer">
      <button class="logout-btn" @click="logout" v-if="userId">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';

// Define types for Course and User
interface Course {
  id: string | null;
  name: string;
  day: string;
  time: string;
}

interface User {
  uid: string;
  fullName: string;
}

const courseName = ref('');
const courseTime = ref('');
const courseDay = ref('');
const courses = ref<Course[]>([]);
const { $firebase } = useNuxtApp();
const router = useRouter();
const userId = ref<string | null>(null);
const fullName = ref('');
const greetingMessage = ref('');
let intervalId: number | null = null;
let initialNotificationFired = false;

// Function to fetch user data from Firebase
const fetchUserData = async () => {
  if (userId.value) {
    const snapshot = await $firebase.database.ref('users/' + userId.value).once('value');
    if (snapshot.exists()) {
      const userData = snapshot.val() as User;
      fullName.value = userData.fullName;
      updateGreetingMessage();
    }
  }
};

// Function to fetch courses from Firebase
const fetchCourses = async () => {
  if (userId.value) {
    const snapshot = await $firebase.database.ref('courses/' + userId.value).once('value');
    if (snapshot.exists()) {
      courses.value = Object.entries(snapshot.val()).map(([id, course]) => ({ id, ...(course as Omit<Course, 'id'>) }));
      if (!initialNotificationFired) {
        checkCourseNotifications();
        initialNotificationFired = true;
      }
    }
  }
};

// Function to add a new course
const addCourse = async () => {
  if (userId.value) {
    const newCourseRef = $firebase.database.ref('courses/' + userId.value).push();
    const newCourse: Course = {
      id: newCourseRef.key,
      name: courseName.value,
      day: courseDay.value,
      time: courseTime.value,
    };
    await newCourseRef.set(newCourse);

    courses.value.push(newCourse);

    courseName.value = '';
    courseDay.value = '';
    courseTime.value = '';
  }
};

// Function to remove a course
const removeCourse = async (courseId: string) => {
  if (userId.value) {
    await $firebase.database.ref('courses/' + userId.value + '/' + courseId).remove();
    courses.value = courses.value.filter(course => course.id !== courseId);
  }
};

// Function to get human-readable time slot
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

// Function to check and display notifications for passed courses and upcoming courses
const checkCourseNotifications = () => {
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  // Notify passed courses only once
  if (!initialNotificationFired) {
    const passedCourses = courses.value.filter(course => {
      const [startTime] = getTimeSlot(course.time).split('-');
      return course.day === currentDay && compareTimes(currentTime, startTime) >= 0;
    });

    passedCourses.forEach(course => {
      notifyDesktop(`Your time for ${course.name} course is passed. Congratulations!`);
    });

    initialNotificationFired = true;
  }

  // Notify upcoming courses at their scheduled times
  const upcomingCourses = courses.value.filter(course => {
    const [startTime] = getTimeSlot(course.time).split('-');
    return course.day === currentDay && compareTimes(currentTime, startTime) < 0;
  });

  upcomingCourses.forEach(course => {
    const [startTime] = getTimeSlot(course.time).split('-');
    const [hours, minutes] = startTime.split(':');
    scheduleNotification(hours, minutes, `Time For Your Course: ${course.name}`);
  });
};

// Function to compare two time strings (HH:MM)
const compareTimes = (time1: string, time2: string) => {
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);

  if (hours1 === hours2) {
    return minutes1 - minutes2;
  }

  return hours1 - hours2;
};

// Function to schedule notification at a specific time
const scheduleNotification = (hours: string, minutes: string, message: string) => {
  const now = new Date();
  const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(hours), Number(minutes));

  if (notificationTime > now) {
    const timeout = notificationTime.getTime() - now.getTime();
    setTimeout(() => {
      notifyDesktop(message);
    }, timeout);
  }
};

// Function to notify on desktop (not mobile)
const notifyDesktop = (message: string) => {
  if (window.Notification && Notification.permission === 'granted') {
    new Notification('Course Notification', { body: message });
  } else if (window.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Course Notification', { body: message });
      }
    });
  }
};

// Function to log out the user
const logout = async () => {
  try {
    await $firebase.auth.signOut();
    userId.value = null; // Clear userId locally
    fullName.value = ''; // Clear fullName locally
    courses.value = []; // Clear courses locally
    router.push('/'); // Redirect to login
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Function to update the greeting message based on the time of day
const updateGreetingMessage = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    greetingMessage.value = `Good Morning, ${fullName.value}`;
  } else if (currentHour < 18) {
    greetingMessage.value = `Good Afternoon, ${fullName.value}`;
  } else {
    greetingMessage.value = `Good Evening, ${fullName.value}`;
  }
};

// Lifecycle hook: Fetch user data and courses on component mount
onMounted(async () => {
  if ($firebase.auth.currentUser) {
    userId.value = $firebase.auth.currentUser.uid;
    await fetchUserData();
    await fetchCourses();
  } else {
    router.push('/'); // Redirect to login if not authenticated
  }

  // Register service worker for notifications
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker Registered');
    } catch (error) {
      console.error('Service Worker Registration Failed', error);
    }
  }
});

// Lifecycle hook: Clear interval on component unmount
onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});

// Watch for changes in authentication state
watch(
  () => $firebase.auth.currentUser,
  async (newUser) => {
    if (newUser) {
      userId.value = newUser.uid;
      await fetchUserData();
      await fetchCourses();
    } else {
      userId.value = null;
      courses.value = []; // Clear courses if not authenticated
      router.push('/'); // Redirect to login if not authenticated
    }
  }
);
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

.greeting {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #352F5D;
  text-transform: uppercase;
}

h1, h2 {
  color: #352F5D;
  text-align: center;
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
  margin-top: 50px;
  list-style-type: none;
  padding: 0;
}

.schedule-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #352F5D;
  margin-bottom: 10px;
  color: #EFE4D2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  flex-wrap: wrap; /* Add this to allow items to wrap */
}

.course-info {
  flex-grow: 1;
  margin-right: 50px;
}

.schedule-list .remove-btn {
  width: 30%;
  background-color: #dc3545;
  color: #EFE4D2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 10px;
}

.schedule-list .remove-btn:hover {
  background-color: #c82333;
}

.footer {
  text-align: center;
  margin-top: 20px;
}

.logout-btn {
  width: 30%;
  background-color: #2380BD;
  color: #EFE4D2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 10px 20px;
}

.logout-btn:hover {
  background-color: #1B6A99;
}

p {
  text-align: center;
  color: #352F5D;
}

/* Media query for mobile devices */
@media (max-width: 600px) {
  .course-info {
    margin-right: 0; /* Reset margin */
    width: 100%; /* Full width */
    margin-bottom: 10px; /* Space between info and button */
  }

  .schedule-list .remove-btn {
    width: 100%; /* Full width */
  }
}
</style>
