import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { trackEvent } from '@redux-beacon/google-analytics-gtag';
import { makeStyles } from '@material-ui/core/styles';
import isEmpty from 'lodash/isEmpty';
import Form from 'components/Common/Form';
import FormButton from 'components/Common/FormButton';
import FormButtonGroup from 'components/Common/FormButtonGroup';
import FormInput from 'components/Common/FormInput';
import ViewTitle from 'components/Common/ViewTitle';
import { postAuthRegister } from "store/actions";
import { isBlank, isEmail } from 'utils';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 800,
        margin: '0 auto'
    }
}));

const AuthRegister = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmed, setConfirmed] = useState('');
    const [errors, setErrors] = useState({});

    const clear = () => {
        setEmail('');
        setPassword('')
        setConfirmed('');
        setErrors({});
    };

    const submit = async () => {
        const submissionErrors = {};

        if (isBlank(email)) {
            submissionErrors.email = 'This field is required.';
        } else if (!isEmail(email)) {
            submissionErrors.email = 'Invalid email address provided.';
        }

        if (confirmed !== password) {
            const msg = "The passwords must match."
            submissionErrors.confirmed = msg;
            submissionErrors.password = msg;
        }

        if (isBlank(password)) {
            submissionErrors.password = 'This field is required.';
        }

        if (isBlank(confirmed)) {
            submissionErrors.confirmed = 'This field is required.';
        }

        if (isEmpty(submissionErrors)) {
            setErrors({});
            const payload = {
                email, password, password_confirm: confirmed
            };
            try {
                await dispatch(postAuthRegister(payload));
                trackEvent(_ => ({category: 'engagement', action: 'sign_up'}));
                history.push("/");
            } catch {}
        }
        else {
            setErrors(submissionErrors)
        }
    };

    return (
        <div className={classes.root}>
            <ViewTitle title="Sign Up" data-test-id="view-title" />
            <Form onEnterKey={() => submit()}>
                <FormInput
                    id="email-input"
                    data-test-id="email-input"
                    label="Email Address"
                    type="email"
                    value={email}
                    error={!!errors.email}
                    helperText={'email' in errors && errors.email}
                    onChange={event => setEmail(event.target.value)} />
                <FormInput
                    id="password-input"
                    data-test-id="password-input"
                    label="Password"
                    type="password"
                    value={password}
                    error={!!errors.password}
                    helperText={'password' in errors && errors.password}
                    onChange={event => setPassword(event.target.value)} />
                <FormInput
                    id="password-confirmed-input"
                    data-test-id="password-confirmed-input"
                    label="Password (Repeated)"
                    type="password"
                    value={confirmed}
                    error={!!errors.confirmed}
                    helperText={'confirmed' in errors && errors.confirmed}
                    onChange={event => setConfirmed(event.target.value)} />
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

export default AuthRegister;