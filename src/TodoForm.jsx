import React from "react";

function TodoForm() {
    return (
        <form>
            <label htmlFor="todoTitle">Todo</label>
            <input type="text" id="todoTitle" />
            <button type="submit" style={{ backgroundColor: 'blue', color: 'white', fontSize: '14px'}}>Add Todo</button>  
        </form>
    );

}

export default TodoForm;