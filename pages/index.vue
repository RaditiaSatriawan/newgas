<template>
  <div class="home-container">
    <div class="form-container">
      <div class="left-panel">
        <div class="avatar">
          <NuxtLink to="/">
            <img src="./avatar.jpg" alt="User Avatar">
          </NuxtLink>
        </div>
        <h2>Welcome to NewGas</h2>
        <p>Newgas is an app designed to help students efficiently manage their course schedules and daily assignments.</p>
        <p>With Newgas, students can easily manage their class schedules and assignments, receive important notifications, and organise their daily activities through an integrated to-do list. The app is designed to increase productivity and help students stay organised in managing their time.</p>
        <div class="nav-links">
          <NuxtLink to="/login">Sign In</NuxtLink>
          <NuxtLink to="/signup">Sign Up</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const pageTitle = ref('NewGas'); 

onMounted(() => {
  document.title = pageTitle.value; 
});
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0093E9;
  background-image: linear-gradient(160deg, #EFE4D2 0%, #32305F 100%);
  color: white;
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
  padding: 40px;
  width: 50%;
  background: rgba(50, 48, 95, 0.8);
  color: white;
  text-align: center;
  border-radius: 8px;
}

.avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
}

h1, h2 {
  margin: 0 0 20px;
}

p {
  margin: 0 0 15px;
}

.nav-links {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-links a {
  background-color: #277BB7;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.nav-links a:hover {
  background-color: #1b5177;
}

/* Responsive Design */
@media (max-width: 768px) {
  .left-panel {
    width: 80%;
    padding: 20px;
  }

  .avatar img {
    width: 100px;
    height: 100px;
  }

  .nav-links a {
    padding: 8px 15px;
  }
}

@media (max-width: 480px) {
  .left-panel {
    width: 100%;
    padding: 15px;
  }

  .avatar img {
    width: 80px;
    height: 80px;
  }

  .nav-links a {
    padding: 6px 10px;
  }
}
</style>