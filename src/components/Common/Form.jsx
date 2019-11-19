import React, { useEffect, useCallback } from 'react';
import { Card, CardContent } from '@material-ui/core';

const Form = ({children, onEnterKey }) => {
    const handleKeyPress = useCallback(event => {
        const { keyCode } = event;
    
        if (keyCode === 13) {
            onEnterKey();
        }
    }, [onEnterKey]);
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
    
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);
    

    return (
        <Card>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default Form;
