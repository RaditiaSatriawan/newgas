<template>
  <div class="signup-container">
    <div class="form-container">
      <div class="left-panel">
        <h2>Registration</h2>
        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
      </div>
      <div class="right-panel">
        <h1>Sign Up</h1>
        <form @submit.prevent="register">
          <div class="form-group">
            <input v-model="email" type="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input v-model="password" type="password" placeholder="Password (min. 6 characters)" required>
          </div>
          <div class="form-group">
            <input v-model="fullName" type="text" placeholder="Full Name" required>
          </div>
          <div class="form-group">
            <input v-model="favoriteSong" type="text" placeholder="Favorite Song" required>
          </div>
          <div class="form-group">
            <input v-model="milkBeforeCereal" type="text" placeholder="Milk Before Cereal (yes/no)" required>
          </div>
          <button type="submit">Create an account</button>
        </form>
        <p>I'm already a member! <NuxtLink to="/login">Log In</NuxtLink></p>
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
const fullName = ref('');
const favoriteSong = ref('');
const milkBeforeCereal = ref('');
const router = useRouter();

const { $firebase } = useNuxtApp();

const register = async () => {
  try {
    if (!validateEmail(email.value) || !validatePassword(password.value)) {
      alert('Invalid email or password (min. 6 characters)');
      return;
    }
    if (!validateField(fullName.value) || !validateField(favoriteSong.value) || !validateField(milkBeforeCereal.value)) {
      alert('Please fill in all fields');
      return;
    }

    const userCredential = await $firebase.auth.createUserWithEmailAndPassword(email.value, password.value);
    const user = userCredential.user;

    if (user) {
      await $firebase.database.ref('users/' + user.uid).set({
        email: email.value,
        fullName: fullName.value,
        favoriteSong: favoriteSong.value,
        milkBeforeCereal: milkBeforeCereal.value,
        lastLogin: Date.now(),
      });

      // Redirect to login page after signup
      router.push('/login');
    } else {
      console.error('User is null after signup');
      alert('Failed to sign up. Please try again.');
    }
  } catch (error: any) {
    console.error('Signup error:', error.message);
    alert('Signup error: ' + error.message);
  }
};

const validateEmail = (email: string) => /^[^@]+@\w+(\.\w+)+\w$/.test(email);
const validatePassword = (password: string) => password.length >= 6;
const validateField = (field: string) => !!field.trim();
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #333;
  color: white;
}

.form-container {
  display: flex;
  background: #EFE4D2;
  color: black;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.left-panel {
  background: #32305F;
  color: white;
  padding: 40px;
  width: 40%;
}

.right-panel {
  padding: 40px;
  width: 60%;
}

h1, h2 {
  margin-bottom: 30px;
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
  background-color: #277BB7;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1b5177;
}

p {
  margin-top: 15px;
}
</style>
