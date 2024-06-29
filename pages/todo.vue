<template>
  <div class="todo-container">
    <div class="form-container">
      <div class="left-panel">
        <div class="header">
          <h1 class="greeting">{{ greetingMessage }}</h1>
        </div>
        <form @submit.prevent="addCourse" v-if="userId">
          <div class="form-group">
            <input v-model="courseName" type="text" placeholder="Course Name" required />
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
          <button type="submit" class="add-course-btn">Add Course</button>
        </form>
        <p v-else>Please wait while loading...</p>
        
        <div class="filter-buttons">
          <button type="button" class="view-btn" @click="viewToday">Today</button>
          <button type="button" class="view-btn" @click="viewWeek">Week</button>
        </div>

        <div class="today-schedule" v-if="viewMode === 'today'">
          <h2>Today's Schedule</h2>
          <ul v-if="userId && todayCourses.length > 0">
            <li v-for="course in todayCourses" :key="course.id">
              <div class="course-info"
                   @mouseover="hoveredCourseId = course.id"
                   @mouseleave="hoveredCourseId = null"
                   @click="confirmCourseRemoval(course.id)">
                <span v-if="hoveredCourseId !== course.id">{{ course.name }}</span> 
                <i v-if="hoveredCourseId === course.id" class="fas fa-trash-alt" style="color: red;"></i>
                <span>{{ course.day }}</span> |
                <span>{{ getTimeSlot(course.time) }}</span>
              </div>
            </li>
          </ul>
          <p v-else-if="userId && todayCourses.length === 0">No courses scheduled for today.</p>
          <p v-else>Please log in to view your schedule.</p>
        </div>
        <div class="week-schedule" v-if="viewMode === 'week'">
          <h2>This Week's Schedule</h2>
          <ul v-if="userId && courses.length > 0">
            <li v-for="course in courses" :key="course.id">
              <div class="course-info"
                   @mouseover="hoveredCourseId = course.id"
                   @mouseleave="hoveredCourseId = null"
                   @click="confirmCourseRemoval(course.id)">
                <span v-if="hoveredCourseId !== course.id">{{ course.name }}</span>
                <i v-if="hoveredCourseId === course.id" class="fas fa-trash-alt" style="color: red;"></i>
                | <span>{{ course.day }}</span> |
                <span>{{ getTimeSlot(course.time) }}</span>
              </div>
            </li>
          </ul>
          <p v-else-if="userId && courses.length === 0">No courses added yet.</p>
          <p v-else>Please log in to view your schedule.</p>
        </div>
        
        <div class="footer">
          <button class="logout-btn" @click="logout" v-if="userId">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useNuxtApp } from '#app';

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
  const todayCourses = ref<Course[]>([]);
  const viewMode = ref('today');
  const { $firebase } = useNuxtApp();
  const router = useRouter();
  const userId = ref<string | null>(null);
  const fullName = ref('');
  const greetingMessage = ref('');
  const hoveredCourseId = ref<string | null>(null); 
  let intervalId: number | null = null;
  let initialNotificationFired = false;

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

  const fetchCourses = async () => {
    if (userId.value) {
      const snapshot = await $firebase.database.ref('courses/' + userId.value).once('value');
      if (snapshot.exists()) {
        courses.value = Object.entries(snapshot.val()).map(([id, course]) => ({ id, ...(course as Omit<Course, 'id'>) }));
        filterTodayCourses();
        if (!initialNotificationFired) {
          checkCourseNotifications();
          initialNotificationFired = true;
        }
      }
    }
  };

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
      filterTodayCourses();

      courseName.value = '';
      courseDay.value = '';
      courseTime.value = '';
    }
  };

  const removeCourse = async (courseId: string) => {
    if (userId.value) {
      await $firebase.database.ref('courses/' + userId.value + '/' + courseId).remove();
      courses.value = courses.value.filter(course => course.id !== courseId);
      filterTodayCourses();
    }
  };

  const filterTodayCourses = () => {
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    todayCourses.value = courses.value.filter(course => course.day === currentDay);
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

  const checkCourseNotifications = () => {
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const upcomingCourses = todayCourses.value.filter(course => {
      const [startTime] = getTimeSlot(course.time).split('-');
      return course.day === currentDay && compareTimes(currentTime, startTime) < 0;
    });

    upcomingCourses.forEach(course => {
      const [startTime] = getTimeSlot(course.time).split('-');
      const [hours, minutes] = startTime.split(':');
      scheduleNotification(hours, minutes, `Time For Your Course: ${course.name}`);
    });
  };

  const compareTimes = (time1: string, time2: string) => {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    if (hours1 === hours2) {
      return minutes1 - minutes2;
    }

    return hours1 - hours2;
  };

  const scheduleNotification = (hours: string, minutes: string, message: string) => {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(Number(hours), Number(minutes), 0, 0);

    const delay = scheduledTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        notifyDesktop(message);
      }, delay);
    }
  };

  const notifyDesktop = (message: string) => {
    if (Notification.permission === 'granted') {
      new Notification(message);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(message);
        }
      });
    }
  };

  const updateGreetingMessage = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
      greetingMessage.value = `Good Morning, ${fullName.value}!`;
    } else if (hour < 18) {
      greetingMessage.value = `Good Afternoon, ${fullName.value}!`;
    } else {
      greetingMessage.value = `Good Evening, ${fullName.value}!`;
    }
  };

  const handleUserLogin = async (user: User) => {
    userId.value = user.uid;
    await fetchUserData();
    await fetchCourses();
  };

  onMounted(() => {
    intervalId = setInterval(checkCourseNotifications, 60000); 

    $firebase.auth.onAuthStateChanged(user => {
      if (user) {
        handleUserLogin(user as User);
      } else {
        router.push('/login');
      }
    });
  });

  // Cleanup interval on component unmount
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  // Fetch data whenever the userId changes
  watch(userId, async newUserId => {
    if (newUserId) {
      await fetchUserData();
      await fetchCourses();
    }
  });

  // Method to view today's schedule
  const viewToday = () => {
    viewMode.value = 'today';
    filterTodayCourses();
  };

  // Method to view week schedule
  const viewWeek = () => {
    viewMode.value = 'week';
  };

  // Method to logout the user
  const logout = async () => {
    await $firebase.auth.signOut();
    userId.value = null;
    fullName.value = '';
    courses.value = [];
    router.push('/login');
  };

  // Method to confirm and remove a course
  const confirmCourseRemoval = (courseId: string) => {
    const course = courses.value.find(course => course.id === courseId);
    if (course) {
      const confirmMessage = `Are you sure you want to delete ${course.name} (${course.day}, ${getTimeSlot(course.time)})?`;
      if (confirm(confirmMessage)) {
        removeCourse(courseId);
      }
    }
  };
</script>

<style scoped>
  .todo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(160deg, #EFE4D2 0%, #32305F 100%);
    padding: 20px;
    box-sizing: border-box;
  }

  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .left-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
    width: 100%;
    max-width: 600px;
    background: rgba(50, 48, 95, 0.8);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    color: #ffffff;
    text-align: center;
  }

  .header {
    margin-bottom: 20px;
  }

  .greeting {
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
  }

  input,
  select,
  button {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
  }

  input::placeholder,
  select {
    color: #999;
  }

  .add-course-btn,
  .view-btn {
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
  }

  .add-course-btn:hover,
  .view-btn:hover {
    background-color: #07ab59;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  .logout-btn {
    background-color: #f38c0f;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
  }

  .logout-btn:hover {
    background-color: #c82333;
  }

  .footer {
    margin-top: 20px;
    width: 100%;
  }

  .filter-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .course-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: transparent; 
    padding: 7px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    width: 100%; 
    max-width: 600px; 
    margin-bottom: 10px; 
    cursor: pointer; 
    transition: background-color 0.3s;
  }

  .course-info:hover {
    background-color: #ffcccc; 
  }

  .course-info span {
    flex: 1;
  }

  .course-info i {
    margin-left: 10px;
    display: none;
  }

  .course-info:hover i {
    display: inline; 
  }

  @media (max-width: 768px) {
    .left-panel {
      padding: 20px;
    }
  }

  @media (max-width: 480px) {
    .left-panel {
      padding: 15px;
    }

    .greeting {
      font-size: 20px;
    }
  }
</style>

