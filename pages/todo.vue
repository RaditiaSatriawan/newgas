<template>
    <div class="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <header class="text-center text-light my-4">
        <h1 class="mb-4">Todo List</h1>
        <form class="search" @submit.prevent="filterTodos">
          <input
            v-model="search"
            class="form-control m-auto rounded-pill"
            type="text"
            name="search"
            placeholder="Search todos"
          />
        </form>
      </header>
  
      <ul class="list-group todos mx-auto text-light">
        <li
          v-for="(todo, index) in filteredTodos"
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-center rounded-pill mb-2"
        >
          <span>{{ todo }}</span>
          <i class="far fa-trash-alt delete" @click="deleteTodo(index)"></i>
        </li>
      </ul>
  
      <form class="add text-center my-4" @submit.prevent="addTodo">
        <label class="text-light mb-2">Add a new todo...</label>
        <input v-model="newTodo" class="form-control m-auto rounded-pill" type="text" name="add" />
        <br />
        <div class="text-center mt-2">
          <input type="submit" class="btn btn-light rounded-pill" value="Add Todo" />
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const todos = ref(['Go to the grocery', 'Do the Laundry', 'Walk the dog']);
  const newTodo = ref('');
  const search = ref('');
  
  const filteredTodos = computed(() => {
    return todos.value.filter(todo =>
      todo.toLowerCase().includes(search.value.toLowerCase())
    );
  });
  
  const addTodo = () => {
    const todo = newTodo.value.trim();
    if (todo.length) {
      todos.value.push(todo);
      newTodo.value = '';
    }
  };
  
  const deleteTodo = (index: number) => {
    todos.value.splice(index, 1);
  };
  </script>
  
  <style scoped>
  body {
    background: #352f5b;
    font-family: "Josefin Sans", sans-serif;
    font-size: 23px;
  }
  
  .container {
    max-width: 400px;
  }
  
  input[type="text"],
  input[type="text"]:focus {
    color: #fff;
    border: none;
    background: rgba(0, 0, 0, 0.2);
    max-width: 400px;
    padding: 10px 20px;
  }
  
  .todos li {
    background: #423a6f;
    color: #fff;
    padding: 10px 20px;
  }
  
  .delete {
    cursor: pointer;
  }
  
  .filtered {
    display: none !important;
  }
  
  .btn:hover {
    background: #423a6f;
    color: #fff;
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-radius: 13px 13px;
    transition: 0.3s;
  }
  
  .btn {
    padding: 10px 20px;
  }
  
  .add input[type="text"] {
    padding: 10px 20px;
  }
  </style>
  