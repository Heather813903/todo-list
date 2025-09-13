

import React, { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import styled from 'styled-components';

const StyledForm = styled.form`
    padding: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const StyledInput = styled.input`
    padding: 0.25rem;
    flex: 1;
`;

const StyledButton = styled.button`
    padding: 0.25rem 0.75rem;
    background-color: #4caf50;
    color: white;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
        font-style: italic;
        background-color: lightgray;
    }

    &:hover:not(:disabled) {
        background-color: #45a049;
    }
`;

    
        

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
        <StyledForm onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId={'todoTitle'}
                labelText={'Todo'}
                ref={todoTitleInput}
                value={workingTodoTitle}
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
            />

                     
            <StyledButton 
                type="submit" 
                disabled={workingTodoTitle.trim() === '' || isSaving}
                
            >
                {isSaving ? 'Saving...' : 'Add Todo'}
                    
            </StyledButton>  
        </StyledForm>
    );

}

export default TodoForm;