<template>
  <div class="home-container">
    <div class="form-container">
      <div class="left-panel">
        <h2>Welcome to NewGas</h2>
        <p>Newgas is an app designed to help students efficiently manage their course schedules and daily assignments.</p>
        <p>With Newgas, students can easily manage their class schedules and assignments, receive important notifications, and organise their daily activities through an integrated to-do list. The app is designed to increase productivity and help students stay organised in managing their time.</p>
      </div>
      <div class="right-panel">
        <h1>NewGas!</h1>
        <AppAlert>
          Navigation:
        </AppAlert>
        <div class="nav-links">
          <NuxtLink to="/login">Sign In</NuxtLink>
          <NuxtLink to="/signup">Sign Up</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<!--<script setup>
import AppAlert from '~/components/AppAlert.vue'; // Ensure you have this component available
</script>-->

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #333;
  color: white;
}

.form-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  width: 50%;
  height: 100%;
}

.left-panel {
  background: black;
  color: white;
}

.right-panel {
  background: white;
  color: black;
}

h1, h2 {
  margin: 0 0 20px;
}

.nav-links {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-links a {
  color: black;
  text-decoration: none;
  padding: 10px 20px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.nav-links a:hover {
  background-color: #f0f0f0;
}
</style>
