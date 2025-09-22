// src/App.jsx
import React, {  useReducer, useState, useEffect, useCallback } from 'react';
import styles from "./App.module.css";
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList.jsx';
import TodosViewForm from './features/TodosViewForm.jsx';
import {
  todosReducer,
  actions as todosActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer.js';


function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  
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
    // === replaced: setIsLoading(true); setErrorMessage(""); ===
    // Use reducer actions instead of individual setState calls.
    dispatch({ type: todosActions.fetchTodos });
    // original code cleared error with setErrorMessage(""); replicate that:
    dispatch({ type: todosActions.clearError });

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

      // === replaced: setTodoList(fetchedTodos) ===
      // We dispatch the raw records and let the reducer map records -> todoList.
      dispatch({ type: todosActions.loadTodos, records: data.records || [] });
    } catch (error) {
      // === replaced: setErrorMessage(error.message) ===
      // Dispatch the error object; reducer will read error.message.
      dispatch({ type: todosActions.setLoadError, error });
    }
    // === removed: finally { setIsLoading(false); } ===
    // Not needed here because loadTodos and setLoadError both set isLoading=false
    // in the reducer per the assignment.
  };

  fetchTodos();
}, [encodeUrl, token]);
 

   async function addTodo(newTodo) {
    dispatch({ type: todosActions.startRequest });
    

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

      dispatch({ type: todosActions.addTodo, todo: savedTodo });
    } 
      catch (error) {
      dispatch({ type: todosActions.setLoadError, error });
    }   
      finally {
      dispatch({ type: todosActions.endRequest });
      
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoState.todoList.find((t) => t.id === editedTodo.id);

  // Optimistically update
    dispatch({ type: todosActions.updateTodo, editedTodo });

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

    // No need to update state from API response
  } catch (error) {
    // Revert on error
    dispatch({ type: todosActions.revertTodo, editedTodo: originalTodo, error });
  }
}
    

    async function completeTodo(id) {
      const originalTodo = todoState.todoList.find((t) => t.id === id);

      dispatch({
        type: todosActions.completeTodo,
        editedTodo: { ...originalTodo, isCompleted: true },
      }); 

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
        throw new Error(response.statusText || "Failed to complete todo");
      }

    } catch (error) {
      
      dispatch({ type: todosActions.revertTodo, editedTodo: originalTodo });
    }
  }


  return (
    
    <div className={styles.app}>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
    
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
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

     
      {todoState.errorMessage && ( 
        <div className={styles.errorContainer}>
          <hr />
          <p>{todoState.errorMessage}</p>
          <button onClick={() => dispatch({ type: todosActions.clearError })}>
            Dismiss Error
          </button> 
        </div>
      )}
    </div>
  );

}
export default App;