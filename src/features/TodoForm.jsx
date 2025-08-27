

import React, { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';

function TodoForm({ onAddTodo, isSaving }) {
    const todoTitleInput = useRef(null);
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    function handleAddTodo(event) {
        event.preventDefault();

        if (!workingTodoTitle.trim()) return; 

        onAddTodo({
            title: workingTodoTitle,
            isCompleted: false,
        });
        
        setWorkingTodoTitle('');
        todoTitleInput.current.focus();

    }

                    

    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId={'todoTitle'}
                labelText={'Todo'}
                ref={todoTitleInput}
                value={workingTodoTitle}
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
            />

                     
            <button 
                type="submit" 
                disabled={workingTodoTitle.trim() === '' || isSaving}
                style={{ backgroundColor: 'blue', color: 'white', fontSize: '14px'}}
            >
                {isSaving ? 'Saving...' : 'Add Todo'}
                    
            </button>  
        </form>
    );

}

export default TodoForm;