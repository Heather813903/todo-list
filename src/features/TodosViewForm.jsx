import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const StyledSection = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: .05rem;
    align-items: center;
`;

const StyledInput = styled.input`
  padding: 0.25rem;
`;

const StyledSelect = styled.select`
  padding: 0.25rem;
`;

const StyledButton = styled.button`
  padding: 0.25rem 0.5rem;

  &:disabled {
    font-style: italic;
    opacity: 0.7;
  }
`;

export default function TodosViewForm({ 
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString
}) {

  const [localQueryString, setLocalQueryString] = useState(queryString);

  const preventRefresh = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    
      
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);


    
  return (
    <StyledForm onSubmit={preventRefresh}>    
        <StyledSection>
          <label htmlFor='search'>Search todos:</label>
          <StyledInput  
            id="search"
            type="text"
            value={localQueryString}
            onChange={e => setLocalQueryString(e.target.value)}
          />
           <StyledButton
            type="button"
            onClick={() => setLocalQueryString('')}          
          >
            Clear  
          </StyledButton>
        </StyledSection>
          

        <StyledSection>
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
          <StyledSelect 
            id="sortDirection"
             name="sortDirection"
            value={sortDirection}
            onChange={e => setSortDirection(e.target.value)}
        >

            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>    
           </StyledSelect>
        </StyledSection>
    </StyledForm>
  )
}