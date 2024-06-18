<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password (min. 6 characters)" required />
        <button type="submit">Login</button>
      </form>
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
  