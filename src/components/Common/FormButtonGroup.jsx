import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

const FormButtonGroup = ({children}) => {
    const classes = useStyles();

    return (
        <div
            className={classes.buttonGroup}
            data-test-id="form-button-group">
            {children}
        </div>
    );
};

export default FormButtonGroup;