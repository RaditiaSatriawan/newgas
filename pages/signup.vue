<template>
    <div>
      <h2>Sign Up</h2>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password (min. 6 characters)" required />
        <input v-model="fullName" type="text" placeholder="Full Name" required />
        <input v-model="favoriteSong" type="text" placeholder="Favorite Song" required />
        <input v-model="milkBeforeCereal" type="text" placeholder="Milk Before Cereal (yes/no)" required />
        <button type="submit">Sign Up</button>
      </form>
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
  