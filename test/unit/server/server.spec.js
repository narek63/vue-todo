const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const expect = chai.expect;
const axios = require('axios');

setResource('todos-test');
chai.use(chaiHttp);

describe('Todos', () => {

  beforeEach(async () => {
    await initializeData();
  });

  it('can get all todos', (done) => {
    chai.request(server).get('/todos').end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('array');
      expect(res.body.length).to.equal(3);
      done();
    });
  });

  it('can get a todo', (done) => {
    chai.request(server).get('/todos/1').end((err, res) => {
      expect(res).to.have.status(200);
      const todo1 = res.body;
      expect(todo1.id).to.equal('1');
      expect(todo1.title).to.equal('Todo 1');
      expect(todo1.completed).be.false;
      done();
    });
  });

  it('can add a todo', (done) => {
    chai.request(server)
      .post('/todos')
      .send({ title: 'New Todo', completed: false })
      .end((err, res) => {
        expect(res).to.have.status(200);
        const todo = res.body;
        expect(todo.id).to.equal('4');
        expect(todo.title).to.equal('New Todo');
        expect(todo.completed).be.false;
        done();
      });
  });

  it('can delete a todo', (done) => {
    chai.request(server).del(`/todos/${1}`).end((err, res) => {
        expect(res).to.have.status(200);
        chai.request(server).get('/todos').end((err, res) => {
          expect(res.body.length).to.equal(2);
          done();
        });
      });
  });

  it('can update a todo', (done) => {
    const updatedTodo = { id: 1, title: 'Updated Todo', completed: false };
    chai.request(server)
      .patch(`/todos/${updatedTodo.id}`)
      .send(updatedTodo)
      .end((err, res) => {
        expect(res).to.have.status(200);
        const todo = res.body;
        expect(todo.title).to.equal('Updated Todo');
        expect(todo.completed).be.false;
        done();
      });
  });

  it('can complete a todo', (done) => {
    const updatedTodo = { id: 1, completed: true };
    chai.request(server)
      .patch(`/todos/complete/${updatedTodo.id}`)
      .send(updatedTodo)
      .end((err, res) => {
        expect(res).to.have.status(200);
        const todo = res.body;
        expect(todo.completed).be.true;
        done();
      });
  });

  async function initializeData() {
    const response = await axios.get('http://5a0c4a196c25030012c335c9.mockapi.io/todos-test');
    const todos = response.data;
    for (let i = 0; i < todos.length; i++) {
      await axios.delete(`http://5a0c4a196c25030012c335c9.mockapi.io/todos-test/${todos[i].id}`);
    }

    const todo1 = { title: 'Todo 1', completed: false };
    const todo2 = { title: 'Todo 2', completed: false };
    const todo3 = { title: 'Todo 3', completed: false };

    await axios.post('http://5a0c4a196c25030012c335c9.mockapi.io/todos-test', todo1);
    await axios.post('http://5a0c4a196c25030012c335c9.mockapi.io/todos-test', todo2);
    await axios.post('http://5a0c4a196c25030012c335c9.mockapi.io/todos-test', todo3);
  }
});

