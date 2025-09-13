import React, { forwardRef } from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  margin-right: 0.5rem;
`;

const StyledInput = styled.input`
  padding: 0.25rem;
  margin-bottom: 0.25rem;
  flex: 1;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
`;


function TextInputWithLabel( { labelText, elementId, onChange, value }, ref) {

    return (
        <InputContainer>    
            <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
            <StyledInput
                type='text'
                id={elementId}
                ref={ref}
                onChange={onChange}
                value={value}
            />
        </InputContainer>
    );
}
           

export default forwardRef (TextInputWithLabel);