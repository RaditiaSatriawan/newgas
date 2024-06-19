<template>
  <div class="login-container">
    <div class="form-container">
      <div class="left-panel">
        <h2>Welcome back!</h2>
        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
      </div>
      <div class="right-panel">
        <h1>Sign In</h1>
        <form @submit.prevent="login">
          <div class="form-group">
            <input v-model="email" type="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input v-model="password" type="password" placeholder="Password (min. 6 characters)" required>
          </div>
          <button type="submit">Sign In</button>
        </form>
        <p>Don't have an account? <NuxtLink to="/signup">Sign Up</NuxtLink></p>
        <p>Back to <NuxtLink to="/">Home</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
  
const email = ref('');
const password = ref('');
const router = useRouter();
  
const { $firebase } = useNuxtApp();
  
const login = async () => {
  try {
    if (!validateEmail(email.value) || !validatePassword(password.value)) {
      alert('Invalid email or password (min. 6 characters)');
      return;
    }
  
    await $firebase.auth.signInWithEmailAndPassword(email.value, password.value);
  
    const user = $firebase.auth.currentUser;
  
    if (user) {
      await $firebase.database.ref('users/' + user.uid).update({
        lastLogin: Date.now(),
      });
  
      // Redirect to todo page after login
      router.push('/todo');
    }
  } catch (error: any) {
    console.error('Login error:', error.message);
    alert('Login error: ' + error.message);
  }
};
  
const validateEmail = (email: string) => /^[^@]+@\w+(\.\w+)+\w$/.test(email);
const validatePassword = (password: string) => password.length >= 6;
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #333;
  color: white;
}

.form-container {
  background: #fff;
  display: flex;
  width: 100%;
  height: 100%;
  color: black;
  overflow: hidden;
}

.left-panel {
  background: black;
  color: white;
  padding: 40px;
  width: 40%;
}

.right-panel {
  padding: 40px;
  width: 60%;
}

h1, h2 {
  margin: 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: black;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #555;
}

p {
  margin-top: 15px;
}
</style>
