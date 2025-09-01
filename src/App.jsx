import React, { useState, useEffect } from 'react';
import './App.css';
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList.jsx';
import TodosViewForm from './features/TodosViewForm.jsx';

function encodeUrl({ url, sortField, sortDirection, queryString }) {
  let searchQuery = "";
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}", {title})`;
  }
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`; 
  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
}


function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // Fetch todos on mount
  useEffect(() => {
  const fetchTodos = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const requestUrl = encodeUrl({ url, sortField, sortDirection, queryString });

    const options = {
      method: "GET",
      headers: { Authorization: token },
    };

    try {
      const response = await fetch(requestUrl, options);
      if (!response.ok) throw new Error(response.statusText || "Failed to fetch todos");

      const data = await response.json();
      const fetchedTodos = data.records.map(record => ({
        id: record.id,
        title: record.fields.title || "",
        isCompleted: record.fields.isCompleted || false,
      }));
      setTodoList(fetchedTodos);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchTodos();
}, [url, token, sortField, sortDirection, queryString]); // ✅ dependency array

  // Add Todo
  async function addTodo(newTodo) {
    setErrorMessage("");
    setIsSaving(true);

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: false,
          },
        },
      ],
    };

    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const requestUrl = encodeUrl({ url, sortField, sortDirection,queryString });
      const response = await fetch(requestUrl, options);
      if (!response.ok) throw new Error(response.statusText || "Failed to add todo");

      const data = await response.json();
      const savedTodo = {
        id: data.records[0].id,
        title: data.records[0].fields.title,
        isCompleted: data.records[0].fields.isCompleted || false,
      };
      setTodoList(prev => [...prev, savedTodo]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  // Update Todo
  async function updateTodo(editedTodo) {
    setErrorMessage("");
    setIsSaving(true);

    const originalTodo = todoList.find(todo => todo.id === editedTodo.id);

    // Optimistic UI
    setTodoList(prev =>
      prev.map(todo => (todo.id === editedTodo.id ? editedTodo : todo))
    );

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const requestUrl = encodeUrl({ url, sortField, sortDirection, queryString });
      const response = await fetch(requestUrl, options);
      if (!response.ok) throw new Error(response.statusText || "Failed to update todo");

      const data = await response.json();
      const updatedTodoFromAPI = {
        id: data.records[0].id,
        title: data.records[0].fields.title,
        isCompleted: data.records[0].fields.isCompleted || false,
      };
      setTodoList(prev =>
        prev.map(todo => (todo.id === updatedTodoFromAPI.id ? updatedTodoFromAPI : todo))
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      // Rollback
      setTodoList(prev =>
        prev.map(todo => (todo.id === originalTodo.id ? originalTodo : todo))
      );
    } finally {
      setIsSaving(false);
    }
  }

  // Complete Todo
  async function completeTodo(id) {
    setErrorMessage("");
    setIsSaving(true);

    const originalTodo = todoList.find(todo => todo.id === id);

    // Optimistic UI
    setTodoList(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, isCompleted: true } : todo))
    );

    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const requestUrl = encodeUrl({ url, sortField, sortDirection, queryString });
      const response = await fetch(requestUrl, options);
      if (!response.ok) throw new Error(response.statusText || "Failed to complete todo");

      const data = await response.json();
      const updatedTodoFromAPI = {
        id: data.records[0].id,
        title: data.records[0].fields.title,
        isCompleted: data.records[0].fields.isCompleted || false,
      };
      setTodoList(prev =>
        prev.map(todo => (todo.id === updatedTodoFromAPI.id ? updatedTodoFromAPI : todo))
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      // Rollback
      setTodoList(prev =>
        prev.map(todo => (todo.id === originalTodo.id ? originalTodo : todo))
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />


      <hr />

      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString} 
      />

      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </>
  );
}

export default App;
