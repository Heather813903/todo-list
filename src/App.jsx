import React, { useState } from 'react';
import './App.css'
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function App() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(title) {
    const newTodo = {
      title: title,
      id: Date.now(),
      isCompleted: false

    };
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => 
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );

    setTodoList(updatedTodos);
  }

  return (
    <>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </>
    
);  


}


export default App;