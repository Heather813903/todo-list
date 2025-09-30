
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TodoForm from "../features/TodoForm";
import TodoList from "../features/TodoList/TodoList.jsx";
import TodosViewForm from "../features/TodosViewForm.jsx"; // default import
import styles from "../App.module.css"; // or a specific module for TodosPage



export default function TodosPage({
  todoList,
  isLoading,
  isSaving,
  errorMessage,
  handleAddTodo,
  handleCompleteTodo,
  handleUpdateTodo,
  handleClearError,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
 
  

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get("page") || '1', 10);

  const indexOfFIrstTodo = (currentPage - 1) * itemsPerPage;
  const indexOfLastTodo = indexOfFIrstTodo + itemsPerPage;

  const currentTodos = todoList.slice(indexOfFIrstTodo, indexOfLastTodo); 

  const totalPages = Math.ceil(todoList.length / itemsPerPage);


useEffect(() => {
  if (totalPages > 0) {
    if (
      isNaN(currentPage) ||
      currentPage < 1 ||
      currentPage > totalPages  
    ) {
      navigate("/");
    }
  }
}, [currentPage, totalPages, navigate]);
 

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: (currentPage - 1).toString() });
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: (currentPage + 1).toString() });
    }
  };

  return (
    <main>
      <h2>Todos</h2>

      {/* Add todo form */}
      <TodoForm handleAddTodo={handleAddTodo} isSaving={isSaving} />

      {/* View/filter/sort form */}
      <TodosViewForm 
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {/* Pagination controls */}
      <div className={styles.paginationControls}> 
        <button onClick={handlePreviousPage}
        disabled={currentPage === 1}
        >Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage}
        diabled={currentPage === totalPages}
        >Next</button>
      </div>

      {/* Todo list */}
      {isLoading ? (
        <p>Loading todos...</p>
      ) : (
        <TodoList
          todoList={currentTodos}
          handleCompleteTodo={handleCompleteTodo}
          handleUpdateTodo={handleUpdateTodo}
        />
      )}

      {/* Optional error message */}
      {errorMessage && (
        <div style={{ color: "red" }}>
          <p>{errorMessage}</p>
          <button onClick={handleClearError}>Dismiss Error</button>
        </div>
      )}
    </main>
  );
}
