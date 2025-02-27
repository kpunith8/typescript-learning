import axios from "axios"

// Dynamically initialize class properties using TypeScript decorators
interface ITodo {
  userId: number
  id: number
  title: string
  completed: boolean
}

function Get(url: string) {
  return function (target: any, name: string) {
    const hiddenInstanceKey = "_$$" + name + "$$_"
    const init = () => {
      return axios.get(url).then((response) => response.data)
    }

    Object.defineProperty(target, name, {
      get: function () {
        return this[hiddenInstanceKey] || (this[hiddenInstanceKey] = init())
      },
      configurable: true,
    })
  }
}

function First() {
  return function (target: any, name: string) {
    const hiddenInstanceKey = "_$$" + name + "$$_"
    const prevInit = Object.getOwnPropertyDescriptor(target, name).get
    const init = (prevInit: () => any) => {
      return prevInit().then((response) => response[0])
    }
    Object.defineProperty(target, name, {
      get: function () {
        return (
          this[hiddenInstanceKey] ||
          (this[hiddenInstanceKey] = init(prevInit.bind(this)))
        )
      },
      configurable: true,
    })
  }
}

class TodoService {
  @First()
  @Get("https://jsonplaceholder.typicode.com/todos")
  todos: Promise<ITodo[]>
}

const todoService = new TodoService()

todoService.todos.then((todos) => {
  console.log(todos)
})