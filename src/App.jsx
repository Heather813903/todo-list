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

    };
    setTodoList([...todoList, newTodo]);
  }

  return (
    <>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} />
    </>
    
);  


}


export default App;