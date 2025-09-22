

const actions = {
     // actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',

    // found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',

    //actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',

    //actions found in helper functions
    updateTodo:'updateTodo',
    completeTodo:'completeTodo',

    //reverts todos when requests fails
    revertTodo:'revertTodo',

    //action on Dismiss Error button
    clearError:'clearError',
};

const initialState = {
    todoList: [], // was useState([])
    isLoading: false, // was UseState(false)
    isSaving: false, // was useState(false)
    errorMessage:'', //was useState('')
};



function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.fetchTodos:
            return {
                ...state,
                isLoading: true,
            };
        case actions.loadTodos:
            return {
                ...state,
                todoList: action.records.map((record) => ({
                    id: record.id,
                    title: record.fields.title,
                    isCompleted: record.fields.isCompleted || false,
                })),
                isLoading: false,
               
            };
        case actions.setLoadError:
            return {
                ...state,
                errorMessage: action.error.message,
                isLoading: false,
            };
        case actions.startRequest:
            return {    
                ...state,
                isSaving: true,
            }; 
                
        
        case actions.addTodo:
            const savedTodo = {
                ...action.todo,
                isCompleted: action.todo.isCompleted ?? false,
            };

            return {
                ...state, 
                todoList: [...state.todoList, savedTodo], 
                isSaving: false, 
            };
        case actions.endRequest:
            return {    
                ...state,
                isLoading: false,
                isSaving: false,
            };
        case actions.revertTodo:
    // nothing here, fall-through
        case actions.updateTodo:
            const updatedTodos = state.todoList.map(todo =>
                todo.id === action.editedTodo.id ? action.editedTodo : todo
    );
            const updatedState = {
                ...state,
                todoList: updatedTodos,
    };
            if (action.error) {
                updatedState.errorMessage = action.error.message;
    }
            return updatedState;

            
        case actions.completeTodo:
            return {        
                ...state,   
                todoList: state.todoList.map(todo =>
                    todo.id === action.editedTodo.id ? action.editedTodo : todo
                ),
            };
        
        case actions.clearError:
            return {    
                ...state,
                errorMessage: '',
            };

        default:
            return state;   
    }
}

const todosReducer = reducer;                

export { actions, initialState, todosReducer };