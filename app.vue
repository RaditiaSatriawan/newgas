<template>
  <div>
    <header>
    <nav>
      <ul>
        <li><NuxtLink to="/todo">To Do</NuxtLink></li>
        <li><NuxtLink to="/">Home</NuxtLink></li>
      </ul>
    </nav>
    </header>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
