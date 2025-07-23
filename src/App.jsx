import React, { useState } from 'react';
import './App.css'
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function App() {
  const [newTodo, setNewTodo] = useState("sample todo");
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>New Todo: {newTodo}</p>
      <TodoList />
    </div> 
    
);  


}

export default App;