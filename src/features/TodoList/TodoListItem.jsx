import React, { useEffect, useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import styles from './TodoListItem.module.css';

 function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    useEffect(() => {
        setWorkingTitle(todo.title);
    }, [todo.title]);

    function handleCancel() {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }
    function handleEdit(event) {
        setWorkingTitle(event.target.value);
    }
    function handleUpdate(event) {
        if (!isEditing) return;
        event.preventDefault();

        onUpdateTodo({
            ...todo,
            title: workingTitle,
        });
        setIsEditing(false);
    }


    return (
        <li className={styles.listItem}>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <TextInputWithLabel 
                        elementId={`editTodo${todo.id}`}
                        labelText="Edit Todo"
                        value={workingTitle}
                        onChange={handleEdit}
                />
                
                <button type="button" onClick={handleCancel}>
                    Cancel
                </button>
                <button type="button" onClick={handleUpdate}>
                    Update
                </button>
            </form>
        
      ) : (        
        <form>
          <label htmlFor={`checkbox${todo.id}`}>
            <input
              type="checkbox"
              id={`checkbox${todo.id}`}
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
          </label>
          <span onClick={() => setIsEditing(true)}>
            {todo.title}
          </span>
        </form>
      )}
        </li>
  );
}

export default TodoListItem;