<template>
  <div class="login-container">
    <div class="form-container">
      <div class="form-content">
        <div class="avatar">
          <NuxtLink to="/" class="avatar">
            <img src="./avatar.jpg" alt="User Avatar">
          </NuxtLink>
        </div>
        <h2>Welcome back!</h2>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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

      // Store user in localStorage to persist login
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/todo');
    }
  } catch (error: any) {
    console.error('Login error:', error.message);
    alert('Login error: ' + error.message);
  }
};

const validateEmail = (email: string) => /^[^@]+@\w+(\.\w+)+\w$/.test(email);
const validatePassword = (password: string) => password.length >= 6;

// Check if user is already logged in (auto-login on page refresh)
onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user && user.uid) {
      router.push('/todo');
    }
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #32305F;
  background-image: linear-gradient(-120deg, #EFE4D2 0%, #32305F 95%);
  padding: 20px;
  box-sizing: border-box;
}

h2 {
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
  .login-container {
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
