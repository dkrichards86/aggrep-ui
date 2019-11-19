import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(3, 1, 1),
    }
}));

const FormButton = (props) => {
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