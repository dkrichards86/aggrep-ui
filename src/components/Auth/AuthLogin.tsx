import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Form from 'components/Common/Form';
import FormButton from 'components/Common/FormButton';
import FormButtonGroup from 'components/Common/FormButtonGroup';
import FormInput from 'components/Common/FormInput';
import ViewTitle from 'components/Common/ViewTitle';
import { postAuthLogin } from "store/actions";
import { SubmissionErrorsType } from 'store/types';
import { isBlank, isEmail } from 'utils';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 800,
        margin: '0 auto'
    },
    bottomButtons: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}));

const authLoginErrors:SubmissionErrorsType = {
    password: '',
    email: '',
};

const AuthLogin:React.FunctionComponent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<SubmissionErrorsType>({...authLoginErrors});

    const clear = ():void => {
        setEmail('');
        setPassword('');
        setErrors({...authLoginErrors});
    };

    const submit = async () => {
        const submissionErrors = {...authLoginErrors};
        let isValid = true;

        if (isBlank(email)) {
            submissionErrors.email = 'This field is required.';
            isValid = false;
        } else if (!isEmail(email)) {
            submissionErrors.email = 'Invalid email address provided.';
            isValid = false;
        }

        if (isBlank(password)) {
            submissionErrors.password = 'This field is required.';
            isValid = false;
        }

        if (isValid) {
            setErrors({...authLoginErrors});
            try {
                await dispatch(postAuthLogin({ email, password }));
            } catch {}
        }
        else {
            setErrors(submissionErrors)
        }
    };

    return (
        <div className={classes.root}>
            <ViewTitle title="Sign In" data-test-id="view-title" />
            <Form onEnterKey={submit}>
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
                <FormButtonGroup>
                    <FormButton
                        data-test-id="clear-button"
                        color="primary"
                        onClick={clear}>
                        Clear
                    </FormButton>
                    <FormButton
                        data-test-id="submit-button"
                        variant="contained"
                        color="primary"
                        onClick={submit}>
                        Submit
                    </FormButton>
                </FormButtonGroup>
            </Form>
            <div className={classes.bottomButtons}>
                <Button component={Link} to='/forgot'>
                    Forgot your password?
                </Button>
                <Button component={Link} to='/register'>
                    Create an account
                </Button>
            </div>
        </div>
    );
};

export default AuthLogin;