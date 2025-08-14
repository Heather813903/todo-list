import React from 'react';

 function TodoListItem({ todo, onCompleteTodo }) {
    return (
        <li>
            <form>
                {/* Checkbox input */}
                <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => onCompleteTodo(todo.id)}
                />
                {/* Todo title */}
                {todo.title}
            </form>
            
        </li>
    );
}

export default TodoListItem;

