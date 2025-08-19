import React, { useState } from 'react';
import './App.css'
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList.jsx';

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

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);
  }
  return (
    <>
      <TodoForm onAddTodo={addTodo} />
      <TodoList 
        todoList={todoList}
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo} 
      />
    </>
    
);  


}


export default App;