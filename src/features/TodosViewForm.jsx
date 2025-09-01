import React from 'react'

export default function TodosViewForm({ 
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString
}) {
    const preventRefresh = (e) => {
        e.preventDefault();
    };
    
  return (
    <form onSubmit={preventRefresh}>    
        <div>
          <label htmlFor='search'>Search todos:</label>
          <input  
            id="search"
            type="text"
            value={queryString}
            onChange={e => setQueryString(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setQueryString('')}          
          >
            Clear  
          </button>
        </div>

        <div>
          <label htmlFor="sortField">Sort by:</label>
          <select 
            id="sortField"
            name="sortField"
            value={sortField}
            onChange={e => setSortField(e.target.value)}
        >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select> 

          <label htmlFor="sortDirection">Direction:</label> 
          <select 
            id="sortDirection"
             name="sortDirection"
            value={sortDirection}
            onChange={e => setSortDirection(e.target.value)}
        >

            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>    
          </select>      
        </div>
    </form>
  )
}