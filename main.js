let input = $(".todo-input");
let todoList = $(".todo-list");
const main = $(".main");

class Todo {
  constructor() {}

  async getData() {
    try {
      return await $.ajax({
        url: "http://localhost:3000/todos",
        dataType: "json",
        type: "GET",
      });
    } catch (error) {
      console.log(new Error(error));
    }
  }

  async addTodo() {
    try {
      if (input.val() !== "") {
        await $.ajax({
          url: "http://localhost:3000/todos",
          type: "POST",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            task: input.val(),
            complited: false,
          }),
        });
        this.render();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async changeStatus(id) {
    try {
      let data = await this.getData();

      for (let item of data) {
        if (item.id == id) {
          item.complited = !item.complited;
          $.ajax({
            url: `http://localhost:3000/todos/${id}`,
            type: "PUT",
            dataType: "json",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              task: item.task,
              complited: item.complited,
            }),
          });
        }
        this.render();
      }
    } catch (error) {
      console.log(new Error(error));
    }
  }

  async removeTodo(id) {
    try {
      let data = await this.getData();

      for (let item of data) {
        if (item.id == id) {
          $.ajax({
            url: `http://localhost:3000/todos/${id}`,
            type: "DELETE",
            dataType: "json",
            headers: {
              "Content-Type": "application/json",
            },
            data: null,
          });
        }
        this.render();
      }
    } catch (error) {
      console.log(new Error(error));
    }
  }

  async render() {
    let todos = await this.getData();
    let list = "";

    try {
      for (const todo of todos) {
        if (!todo) {
          return;
        } else {
          let statusColor = todo.complited ? "green" : "yellow";

          list += `<li data-id="${todo.id}" class="todo-item ${statusColor}">
                        ${todo.task}
                  <button class="completed-button"> &#9745; </button>
                  <button class="trash-button"> &#10006; </button> 
                </li>`;
        }
      }
      todoList.html(list);
    } catch (error) {
      console.log(new Error(error));
    }
  }
}

const createTodo = new Todo();
createTodo.render();

main.on("click", (e) => {
  let target = e.target;

  if (target.className === "todo-button") {
    createTodo.addTodo();
    createTodo.render();
    input.val(null);
  }
});

todoList.on("click", (e) => {
  let target = e.target;
  let getId = target.parentElement.dataset.id;

  if (target.className === "completed-button") {
    createTodo.changeStatus(getId);
  } else if (target.className === "trash-button") {
    createTodo.removeTodo(getId);
  }
});
