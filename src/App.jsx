import React, { useState } from 'react';
import './App.css'
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function App() {
  const [exampleSateValue, setExampleStateValue] = useState(42);
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>42</p>
      <TodoList />
    </div> 
    
);  


}

export default App;