import React, { forwardRef } from 'react';

function TextInputWithLabel( { labelText, elementId, onChange, value }, ref) {



    return (
        <>
            <label htmlFor={elementId}>{labelText}</label>
            <input
                type='text'
                id={elementId}
                ref={ref}
                onChange={onChange}
                value={value}
            />
        </>
    );
}

export default forwardRef (TextInputWithLabel);