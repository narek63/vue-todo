<template>
  <div class="todo-list">
    <section class="section">
      <div class="container">
        <div class="columns">
            <div class="column">
              <h1 class="title todos-title">Todos ({{ todos.length }})</h1>
            </div>
            <div class="column">
              <p class="control has-addons">
                <input id="add-todo-input" class="input" type="text" name="new-todo"
                    v-model="newTodoText"
                    @keyup="checkCanAddTodo"
                    placeholder="Add thing to do">
                <a id="add-todo-button" class="button is-primary"
                    :class="{ 'is-disabled': !canAddTodo }"
                    @click="addTodo">
                  <span class="icon is-small"><i class="fa fa-plus"></i></span>
                </a>
              </p>
            </div>
            </div>
            <hr>
        </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column is-one-quarter" v-for="todo in todos">
            <div class="todo">
              <div class="card">
                <div class="card-content">
                  <div class="content">
                    <h3>{{ todo.title }}</h3>
                    <small>{{ todo.created_at | moment('MMM Do YYYY') }}</small>
                  </div>
                </div>
                <footer class="card-footer">
                  <a class="card-footer-item complete-todo" title="Complete" @click="completeTodo(todo)">
                    <span class="icon"><i class="fa fa-check"></i></span>
                  </a>
                  <a class="card-footer-item edit-todo" title="Edit" @click="editTodo(todo)">
                    <span class="icon"><i class="fa fa-pencil"></i></span>
                  </a>
                  <a class="card-footer-item edit-todo" title="Delete" @click="deleteTodo(todo)">
                    <span class="icon"><i class="fa fa-times"></i></span>
                  </a>
                </footer>
              </div>
            </div>
            <div class="modal" :class="{ 'is-active': showEditForm }" >
              <div class="modal-background"></div>
              <input class="input" type="hidden" v-model="todoToEdit">
              <div class="modal-content">
                <div class="box">
                  <p class="control">
                    <input id="edit-todo-input" class="input" type="text" v-model="editTodoText">
                  </p>
                  <div class="control is-grouped">
                    <p class="control">
                      <button  id="save-todo" class="button is-primary" @click="saveTodo">Save</button>
                    </p>
                    <p class="control">
                      <button class="button is-light" @click="removeEditModal">Cancel</button>
                    </p>
                  </div>
                </div>
              </div>
              <button class="modal-close" @click="removeEditModal"></button>
            </div>
          </div>
          <hr>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title completed-todos-title"><a @click="toggleCompletedTodos">Completed Todos ({{ completedTodos.length }})</a></h1>
        <hr>
        <div class="columns is-multiline" :class="{ 'is-hidden': !showCompleted }">
          <div class="column is-3" v-for="todo in completedTodos">
            <div class="completed-todo">
              <div class="card">
                <div class="card-content">
                  <button class="delete is-pulled-right" @click="deleteTodo(todo)"></button>
                  <div class="content">
                    <h3>{{ todo.title }}</h3>
                    <small>{{ todo.created_at | moment('MMM Do YYYY') }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';

Vue.use(require('vue-moment'));

export default {
  name: 'todo-list',
  data () {
    return {
      canAddTodo: false,
      todos: [],
      completedTodos: [],
      newTodoText: '',
      showCompleted: false,
      editTodoText: false,
      todoToEdit: {},
      editTodoText: '',
      showEditForm: false
    }
  },
  mounted() {
    this.fetchTodos();
  },
  methods: {
    fetchTodos() {
      axios.get('/todos')
        .then(response => {
          this.todos = response.data.filter(todo => !todo.completed);
          this.completedTodos = response.data.filter(todo => todo.completed);
        })
        .catch(error => console.log(error));
    },
    addTodo() {
      const id = this.todos.length + 1;
      let newTodo = {
        id: id,
        title: this.newTodoText,
        created_at: new Date(),
        completed: false
      };

      this.todos.push(newTodo);
      this.newTodoText = '';
      this.canAddTodo = false;

      axios.post('/todos', newTodo)
        .then(response => console.log('Todo Successfully added.'));
    },
    completeTodo(todo) {
      todo.completed = true;
      
      this.todos = this.todos.filter(t => t.id !== todo.id);
      this.completedTodos.push(todo);
      this.newTodoText = '';
      this.canAddTodo = false;
      
      axios.put(`/todos/${todo.id}`, todo)
        .then(response => console.log(`completing todo ${todo.id}`));
    },
    editTodo(todo) {
      this.showEditForm = true;
      this.todoToEdit = todo;
      this.editTodoText = todo.title;
    },
    saveTodo() {
      this.todoToEdit.title = this.editTodoText;

      axios.put(`/todos/${this.todoToEdit.id}`, this.todoToEdit)
        .then(response => {
          this.removeEditModal();
        });
    },
    deleteTodo(todo) {
      this.todos = this.todos.filter((t) => t.id !== todo.id);
      this.completedTodos = this.completedTodos.filter((t) =>  t.id !== todo.id);
      axios.delete(`/todos/${todo.id}`);
    },
    checkCanAddTodo () {
      this.canAddTodo = this.newTodo !== '';
    },
    removeEditModal() {
      this.showEditForm = false;
      this.editTodoText = '';
    },
    toggleCompletedTodos() {
      this.showCompleted = this.showCompleted ? false : true;
    }
  }
}
</script>

<style scoped>
</style>
