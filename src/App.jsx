// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import styles from "./App.module.css";
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList.jsx';
import TodosViewForm from './features/TodosViewForm.jsx';


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

  const encodeUrl = useCallback(() => {
    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", {title})`;
    }

    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, sortField, sortDirection, queryString]);
   

    useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const requestUrl = encodeUrl();

      const options = {
        method: "GET",
        headers: { Authorization: token },
      };

      try {
        const response = await fetch(requestUrl, options);
        if (!response.ok) {
          throw new Error(response.statusText || "Failed to fetch todos");
        }

        const data = await response.json();
               const fetchedTodos = (data.records || []).map((record) => ({
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
   
  }, [encodeUrl, token]);

   async function addTodo(newTodo) {
    setErrorMessage("");
    setIsSaving(true);

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted || false,
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
      const requestUrl = encodeUrl();
      const response = await fetch(requestUrl, options);

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to add todo");
      }

      const data = await response.json();

      const savedRecord = data.records && data.records[0];
      const savedTodo = {
        id: savedRecord.id,
        title: savedRecord.fields.title,
        isCompleted: savedRecord.fields.isCompleted || false,
      };

      setTodoList((prev) => [...prev, savedTodo]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function updateTodo(editedTodo) {
    setErrorMessage("");
    setIsSaving(true);

    const originalTodo = todoList.find((t) => t.id === editedTodo.id);


    setTodoList((prev) => prev.map((t) => (t.id === editedTodo.id ? editedTodo : t)));

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
      const requestUrl = encodeUrl();
      const response = await fetch(requestUrl, options);

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to update todo");
      }

      const data = await response.json();
      const saved = data.records && data.records[0];

      const updatedTodoFromAPI = {
        id: saved.id,
        title: saved.fields.title,
        isCompleted: saved.fields.isCompleted || false,
      };

    
      setTodoList((prev) => prev.map((t) => (t.id === updatedTodoFromAPI.id ? updatedTodoFromAPI : t)));
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

         setTodoList((prev) => prev.map((t) => (t.id === originalTodo.id ? originalTodo : t)));
    } finally {
      setIsSaving(false);
    }
  }

    async function completeTodo(id) {
    setErrorMessage("");
    setIsSaving(true);

    const originalTodo = todoList.find((t) => t.id === id);


    setTodoList((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: true } : t)));

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
      const requestUrl = encodeUrl();
      const response = await fetch(requestUrl, options);

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to complete todo");
      }

      const data = await response.json();
      const saved = data.records && data.records[0];

      const updatedTodoFromAPI = {
        id: saved.id,
        title: saved.fields.title,
        isCompleted: saved.fields.isCompleted || false,
      };

      setTodoList((prev) => prev.map((t) => (t.id === updatedTodoFromAPI.id ? updatedTodoFromAPI : t)));
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      
      setTodoList((prev) => prev.map((t) => (t.id === originalTodo.id ? originalTodo : t)));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    

    <div className={styles.app}>
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
        <div className={styles.errorContainer}>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
