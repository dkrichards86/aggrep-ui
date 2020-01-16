import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(3, 1, 1),
    }
}));

interface FormButtonProps {
    variant?: "text" | "outlined" | "contained" | undefined;
    color?: "inherit" | "default" | "primary" | "secondary" | undefined;
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    children: React.ReactNode;
};

const FormButton: React.FunctionComponent<FormButtonProps> = (props) => {
    const classes = useStyles();
    
    return (
        <Button
            variant={props.variant}
            color={props.color}
            onClick={props.onClick}
            className={classes.button}>
            {props.children}
        </Button>
    );
};

export default FormButton;