import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import isEmpty from 'lodash/isEmpty';
import { makeStyles } from '@material-ui/core/styles';
import Form from 'components/Common/Form';
import FormButton from 'components/Common/FormButton';
import FormButtonGroup from 'components/Common/FormButtonGroup';
import FormInput from 'components/Common/FormInput';
import ViewTitle from 'components/Common/ViewTitle';
import { postAuthPasswordReset } from 'store/actions';

import { isBlank, isEmail } from 'utils';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 800,
        margin: '0 auto'
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        margin: theme.spacing(3, 1, 1),
    }
}));

const AuthReset = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const clear = () => {
        setEmail('');
        setErrors({});
    };

    const submit = () => {
        const submissionErrors = {};

        if (isBlank(email)) {
            submissionErrors.email = 'This field is required.';
        } else if (!isEmail(email)) {
            submissionErrors.email = 'Invalid email address provided.';
        }

        if (isEmpty(submissionErrors)) {
            setErrors({});
            dispatch(postAuthPasswordReset({ email }));
            history.push("/");
        }
        else {
            setErrors(submissionErrors)
        }
    };

    return (
        <div className={classes.root}>
            <ViewTitle title="Forgot your Password?"  data-test-id="view-title" />
            <Form onEnterKey={() => submit()}>
                <FormInput
                    id="email-input"
                    data-test-id="email-input"
                    label="Email Address"
                    type="email"
                    helperText={'email' in errors && errors.email}
                    error={!!errors.email}
                    value={email}
                    onChange={event => setEmail(event.target.value)} />
                <FormButtonGroup>
                    <FormButton
                        data-test-id="clear-button"
                        color="primary"
                        onClick={() => clear()}>
                        Clear
                    </FormButton>
                    <FormButton
                        data-test-id="submit-button"
                        variant="contained"
                        color="primary"
                        onClick={() => submit()}>
                        Submit
                    </FormButton>
                </FormButtonGroup>
            </Form>
        </div>
    );
};

export default AuthReset;