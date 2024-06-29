<template>
  <div class="signup-container">
    <div class="form-container">
      <div class="form-content">
        <div class="avatar">
          <NuxtLink to="/" class="avatar">
            <img src="./avatar.png" alt="User Avatar">
          </NuxtLink>
        </div>
        <h2>Create Your Account</h2>
        <form @submit.prevent="register">
          <div class="form-group">
            <input v-model="fullName" type="text" placeholder="Full Name" required>
          </div>
          <div class="form-group">
            <input v-model="email" type="email" placeholder="Email Address" required>
          </div>
          <div class="form-group">
            <input v-model="password" type="password" placeholder="Password" required>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p>I'm already a member! <NuxtLink to="/login">Sign In</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';

const fullName = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const { $firebase } = useNuxtApp();

const register = async () => {
  try {
    const userCredential = await $firebase.auth.createUserWithEmailAndPassword(email.value, password.value);
    const user = userCredential.user;
    if (user) {
      await $firebase.database.ref('users/' + user.uid).set({
        fullName: fullName.value,
        email: email.value,
        password: password.value,
        createdAt: Date.now()
      });
      router.push('/login');
    } else {
      alert('Failed to sign up. Please try again.');
    }
  } catch (error) {
    alert('Signup error: ' + error.message);
  }
};
</script>

<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #32305F;
  background-image: linear-gradient(80deg, #EFE4D2 0%, #32305F 95%);
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  margin-bottom: 20px;
  text-align: center;
}

.form-container {
  background-color: rgba(50, 48, 95, 0.8);
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  width: 100%;
  margin-bottom: 15px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #277BB7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #1b5177;
}

p {
  margin-top: 15px;
  text-align: center;
}

p a {
  color: #277BB7;
  text-decoration: none;
}

p a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .signup-container {
    padding: 10px;
  }

  .form-container {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 15px;
  }

  .form-group input {
    padding: 8px;
  }

  button {
    padding: 8px;
  }
}
</style>
