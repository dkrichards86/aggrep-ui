import React, { useEffect, useCallback } from 'react';
import { Card, CardContent } from '@material-ui/core';

interface FormProps {
    onEnterKey: () => void;
    children: React.ReactNode;
};

const Form: React.FunctionComponent<FormProps> = ({children, onEnterKey }) => {
    const handleKeyPress = useCallback<any>((event:any) => {
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
