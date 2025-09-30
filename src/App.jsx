import React, { useReducer, useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styles from "./App.module.css";
import TodosPage from './pages/TodosPage.jsx';
import Header from './shared/Header.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import {
  todosReducer,
  actions as todosActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer.js';


function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const location = useLocation();
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState(""); 

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // Encodes URL for fetching/sorting/filtering
  const encodeUrl = useCallback(() => {
    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", {title})`;
    }
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, sortField, sortDirection, queryString]);

  // Fetch todos from API
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todosActions.fetchTodos });
      dispatch({ type: todosActions.clearError });

      const requestUrl = encodeUrl();
      const options = { method: "GET", headers: { Authorization: token } };

      try {
        const response = await fetch(requestUrl, options);
        if (!response.ok) throw new Error(response.statusText || "Failed to fetch todos");

        const data = await response.json();
        dispatch({ type: todosActions.loadTodos, records: data.records || [] });
      } catch (error) {
        dispatch({ type: todosActions.setLoadError, error });
      }
    };

    fetchTodos();
  }, [encodeUrl, token]);

  // Update document title based on route
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Todo List";
        break;
      case "/about":
        document.title = "About";
        break;
      default:
        document.title = "Not Found";
        break;
    }
  }, [location]);

  // --- CRUD functions ---
  const addTodo = async (newTodo) => {
    dispatch({ type: todosActions.startRequest });

    const payload = { records: [{ fields: { title: newTodo.title, isCompleted: newTodo.isCompleted || false } }] };
    const options = { method: "POST", headers: { Authorization: token, "Content-Type": "application/json" }, body: JSON.stringify(payload) };

    try {
      const response = await fetch(encodeUrl(), options);
      if (!response.ok) throw new Error(response.statusText || "Failed to add todo");

      const data = await response.json();
      const savedRecord = data.records && data.records[0];
      const savedTodo = { id: savedRecord.id, title: savedRecord.fields.title, isCompleted: savedRecord.fields.isCompleted || false };

      dispatch({ type: todosActions.addTodo, todo: savedTodo });
    } catch (error) {
      dispatch({ type: todosActions.setLoadError, error });
    } finally {
      dispatch({ type: todosActions.endRequest });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find(t => t.id === editedTodo.id);
    dispatch({ type: todosActions.updateTodo, editedTodo });

    const payload = { records: [{ id: editedTodo.id, fields: { title: editedTodo.title, isCompleted: editedTodo.isCompleted } }] };
    const options = { method: "PATCH", headers: { Authorization: token, "Content-Type": "application/json" }, body: JSON.stringify(payload) };

    try {
      const response = await fetch(encodeUrl(), options);
      if (!response.ok) throw new Error(response.statusText || "Failed to update todo");
    } catch (error) {
      dispatch({ type: todosActions.revertTodo, editedTodo: originalTodo, error });
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoState.todoList.find(t => t.id === id);
    const editedTodo = { ...originalTodo, isCompleted: true };
    dispatch({ type: todosActions.completeTodo, editedTodo });

    const payload = { records: [{ id: editedTodo.id, fields: { title: editedTodo.title, isCompleted: editedTodo.isCompleted } }] };
    const options = { method: "PATCH", headers: { Authorization: token, "Content-Type": "application/json" }, body: JSON.stringify(payload) };

    try {
      const response = await fetch(encodeUrl(), options);
      if (!response.ok) throw new Error(response.statusText || "Failed to complete todo");
    } catch (error) {
      dispatch({ type: todosActions.revertTodo, editedTodo: originalTodo });
    }
  };

  // --- JSX ---
  return (
    <div className={styles.app}>
      <Header title="My Todo App" />

      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoList={todoState.todoList}
              isLoading={todoState.isLoading}
              isSaving={todoState.isSaving}
              errorMessage={todoState.errorMessage}
              handleAddTodo={addTodo}
              handleCompleteTodo={completeTodo}
              handleUpdateTodo={updateTodo}
              handleClearError={() => dispatch({ type: todosActions.clearError })}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              queryString={queryString}
              setQueryString={setQueryString}
            />
          }
        />
        <Route
          path="/about"
          element={<About />}  />
        <Route
          path="*"
          element={<NotFound />} />
      </Routes>

      {todoState.errorMessage && (
        <div className={styles.errorContainer}>
          <hr />
          <p>{todoState.errorMessage}</p>
          <button onClick={() => dispatch({ type: todosActions.clearError })}>Dismiss Error</button>
        </div>
      )}
    </div>
  );
}

export default App;
