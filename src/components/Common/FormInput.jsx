import React from 'react';
import {
    FormControl, FormGroup, InputLabel, Input, FormHelperText
} from '@material-ui/core';

const FormInput = (props) => {
    return (
        <FormControl fullWidth margin="dense">
            <FormGroup>
                <InputLabel
                    htmlFor={props.id}
                    error={props.error}>
                    {props.label}
                </InputLabel>
                <Input
                    id={props.id}
                    aria-describedby={`${props.id}-helper-text`}
                    type={props.type}
                    value={props.value}
                    error={props.error}
                    onChange={props.onChange} />
                {props.helperText && (
                    <FormHelperText
                        id={`${props.id}-helper-text`}
                        error={props.error}>
                        {props.helperText}
                    </FormHelperText>
                )}
            </FormGroup>
        </FormControl>
    );
};

export default FormInput;
