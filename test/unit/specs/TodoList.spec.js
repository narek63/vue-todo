import Vue from 'vue';
import TodoList from '@/components/TodoList';
import moxios from 'moxios';

describe('Data Initizialization', () => {
  const vm = new Vue(TodoList).$mount();

  it('should initialize data', (done) => {
    expect(vm.canAddTodo).to.equal(false);
    expect(vm.todos.length).to.equal(0);
    expect(vm.newTodoText).to.equal('');
    expect(vm.todoToEdit).to.be.an('object');
    expect(vm.showEditForm).to.equal(false);
    done();
  });
});

describe('Methods', () => {
  const vm = new Vue(TodoList).$mount();
  
  beforeEach(function () {
    moxios.install();
  });

  afterEach(function () {
    moxios.uninstall();
  });

  it('should fetch todos', (done) => {
    const fakeRepsonse = [
      { id: 1, title: 'Todo 1', created_at: new Date(), completed: false },
      { id: 2, title: 'Todo 2', created_at: new Date(), completed: false },
      { id: 3, title: 'Completed Todo 1', created_at: new Date(), completed: true }
    ];
    vm.fetchTodos();
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: fakeRepsonse
      }).then(() => {
        expect(vm.todos.length).to.equal(2);
        expect(vm.completedTodos.length).to.equal(1);
        done();
      }).catch(done);
    });
  });

  it('should add a todo', (done) => {
    const newTodo = { id: 4, title: 'Todo 3', created_at: new Date(), completed: false };
    vm.addTodo(newTodo);

    expect(vm.todos.length).to.equal(3);
    expect(vm.completedTodos.length).to.equal(1);
    expect(vm.newTodoText).to.equal('');
    expect(vm.canAddTodo).to.equal(false);
    done();
  });

  it('should complete a todo', (done) => {
    const todoToBeCompleted = vm.todos.find((todo) => todo.id = 4);
    vm.completeTodo(todoToBeCompleted);

    expect(vm.todos.length).to.equal(2);
    expect(vm.completedTodos.length).to.equal(2);
    expect(vm.newTodoText).to.equal('');
    expect(vm.canAddTodo).to.equal(false);
    done();
  });
  
  it('should edit a todo', (done) => {
    const todo = vm.todos.find((todo) => todo.id = 1);
    vm.editTodo(todo);

    expect(vm.showEditForm).to.equal(true);
    expect(vm.todoToEdit).to.equal(todo);
    expect(vm.editTodoText).to.equal(todo.title);
    done();
  });
    
  it('should save a todo', (done) => {
    const todo = vm.todos.find((todo) => todo.id = 1);
    vm.editTodoText = 'This is a Todo';
    vm.saveTodo(todo);

    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith({
        status: 200
      }).then(() => {
        expect(vm.todoToEdit.title).to.equal( 'This is a Todo');
        expect(vm.showEditForm).to.equal(false);
        expect(vm.editTodoText).to.equal('');
        done();
      }).catch(done);
    });
  });
  
  it('should delete a todo', (done) => {
    const todo = vm.todos.find((todo) => todo.id = 4);
    expect(vm.todos.length).to.equal(2);

    vm.deleteTodo(todo);

    expect(vm.todos.length).to.equal(1);
    done();
  });
  
  it('should check can add todo', (done) => {
    vm.newTodo = '';
    vm.checkCanAddTodo();
    expect(vm.canAddTodo).to.equal(false);

    vm.newTodo = 'Test';
    vm.checkCanAddTodo();
    expect(vm.canAddTodo).to.equal(true);
    done();
  });

  it('should remove modal', (done) => {
    vm.removeEditModal();

    expect(vm.showEditForm).to.equal(false);
    expect(vm.editTodoText).to.equal('');
    done();
  });

  it('should toggle completed todos', (done) => {
    vm.showCompleted = false;
    vm.toggleCompletedTodos();
    expect(vm.showCompleted).to.equal(true);

    vm.showCompleted = true;
    vm.toggleCompletedTodos();
    expect(vm.showCompleted).to.equal(false);
    done();
  });
});

describe('The Todo list works', () => {
  const todoListFakeRepsonse = [
    { id: 1, title: 'Todo 1', created_at: new Date(), completed: false },
    { id: 2, title: 'Todo 2', created_at: new Date(), completed: false },
    { id: 3, title: 'Todo 3', created_at: new Date(), completed: false },
    { id: 4, title: 'Completed Todo 1', created_at: new Date(), completed: true },
    { id: 5, title: 'Completed Todo 2', created_at: new Date(), completed: true }
  ];

  beforeEach(function () {
    moxios.install();
  });

  afterEach(function () {
    moxios.uninstall();
  });

  it('should render the titles', (done) => {
    const vm = new Vue(TodoList).$mount();
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith({ 
        status: 200,
        response: todoListFakeRepsonse
      }).then(() => {
          expect(vm.$el.querySelector('h1.todos-title').textContent).to.equal('Todos (3)');
          expect(vm.$el.querySelector('h1.completed-todos-title').textContent).to.equal('Completed Todos (2)');
          done();
      }).catch(done);
    });
  });
  
  it('should render the todos', (done) => {
    const vm = new Vue(TodoList).$mount();
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith({ 
        status: 200,
        response: todoListFakeRepsonse
      }).then(() => {
        expect(vm.todos.length).to.equal(3);
        expect(vm.completedTodos.length).to.equal(2);

        const todos = [...vm.$el.querySelectorAll('.todo h3')];
        expect(todos[0].textContent).to.equal('Todo 1');
        expect(todos[1].textContent).to.equal('Todo 2');
        expect(todos[2].textContent).to.equal('Todo 3');

        const completedTodos = [...vm.$el.querySelectorAll('.completed-todo h3')];
        expect(completedTodos[0].textContent).to.equal('Completed Todo 1');
        expect(completedTodos[1].textContent).to.equal('Completed Todo 2');
        done();
      }).catch(done);
    });
  });

  it('should add a todo', (done) => {
    const vm = new Vue(TodoList).$mount();

    expect(vm.todos.length).to.equal(0);
    expect(vm.completedTodos.length).to.equal(0);

    vm.$el.querySelector('#add-todo-input').value = 'This is a todo';
    vm.$el.querySelector('#add-todo-button').click();

    expect(vm.todos.length).to.equal(1);
    expect(vm.completedTodos.length).to.equal(0);

    Vue.nextTick(() => {
      expect(vm.$el.querySelector('h1.todos-title').textContent).to.equal('Todos (1)');
      expect(vm.$el.querySelector('h1.completed-todos-title').textContent).to.equal('Completed Todos (0)');
      done();
    });
  });
  
  it('should complete a todo', (done) => {
    const vm = new Vue(TodoList).$mount();

    vm.todos.push({ id: 1, title: 'Todo 1', created_at: new Date(), completed: false });

    expect(vm.todos.length).to.equal(1);
    expect(vm.completedTodos.length).to.equal(0);

    Vue.nextTick(() => {
      expect(vm.$el.querySelector('h1.todos-title').textContent).to.equal('Todos (1)');
      expect(vm.$el.querySelector('h1.completed-todos-title').textContent).to.equal('Completed Todos (0)');
      
      vm.$el.querySelector('a.card-footer-item.complete-todo').click();

      expect(vm.todos.length).to.equal(0);
      expect(vm.completedTodos.length).to.equal(1);

      Vue.nextTick(() => {
        expect(vm.$el.querySelector('h1.todos-title').textContent).to.equal('Todos (0)');
        expect(vm.$el.querySelector('h1.completed-todos-title').textContent).to.equal('Completed Todos (1)');
        done();
      });
    });
  });

  // it('should edit a todo', (done) => {
  //   const vm = new Vue(TodoList).$mount();

  //   vm.todos.push({ id: 1, title: 'Todo 1', created_at: new Date(), completed: false });

  //   Vue.nextTick(() => {
  //     vm.$el.querySelector('a.card-footer-item.edit-todo').click();

  //     Vue.nextTick(() => {
  //       vm.$el.querySelector('#edit-todo-input').value = 'First Todo';
  //       vm.$el.querySelector('#save-todo').click();

  //       Vue.nextTick(() => {
  //         const todos = [...vm.$el.querySelectorAll('.todo h3')];
  //         expect(todos[0].textContent).to.equal('First Todo');
  //         done();
  //       });
  //     });
  //   });
  // });

  // TODO:
  // - edit todo
  // - delete todo
  // 
  //
  // - completed list?
  // - delete from completed list?
  // - move completed back to not completed?
});
