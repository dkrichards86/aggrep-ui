import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Form from 'components/Common/Form';
import FormButton from 'components/Common/FormButton';
import FormButtonGroup from 'components/Common/FormButtonGroup';
import FormInput from 'components/Common/FormInput';
import ViewTitle from 'components/Common/ViewTitle';
import { postAuthPasswordUpdate } from 'store/actions';
import { SubmissionErrorsType } from 'store/types';
import { isBlank } from 'utils';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 800,
        margin: '0 auto'
    },
}));

const authChangePasswordErrors:SubmissionErrorsType = {
    password: '',
    confirmed: '',
    changed: ''
};

const AuthChangePassword:React.FunctionComponent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [password, setPassword] = useState<string>('');
    const [changed, setChanged] = useState<string>('');
    const [confirmed, setConfirmed] = useState<string>('');
    const [errors, setErrors] = useState<SubmissionErrorsType>({...authChangePasswordErrors});

    const clear = ():void => {
        setPassword('');
        setChanged('');
        setConfirmed('');
        setErrors({...authChangePasswordErrors});
    };

    const submit = async () => {
        const submissionErrors = {...authChangePasswordErrors};
        let isValid = true;

        if (isBlank(password)) {
            submissionErrors.password = 'This field is required.';
            isValid = false;
        }

        if (confirmed !== changed) {
            const msg = "The passwords must match."
            submissionErrors.confirmed = msg;
            submissionErrors.changed = msg;
            isValid = false;
        }

        if (isBlank(changed)) {
            submissionErrors.changed = 'This field is required.';
            isValid = false;
        }

        if (isBlank(confirmed)) {
            submissionErrors.confirmed = 'This field is required.';
            isValid = false;
        }

        if (isValid) {
            setErrors({...authChangePasswordErrors});
            const payload = {
                curr_password: password,
                new_password: changed,
                password_confirm: confirmed
            };
            try {
                await dispatch(postAuthPasswordUpdate(payload));
                history.push("/");
            } catch {}
        }
        else {
            setErrors(submissionErrors);
        }
    };

    return (
        <div className={classes.root}>
            <ViewTitle title="Update Password" data-test-id="view-title"/>
            <Form onEnterKey={() => submit()}>
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
                    id="password-change-input"
                    data-test-id="password-change-input"
                    label="New Password"
                    type="password"
                    value={changed}
                    error={!!errors.changed}
                    helperText={'changed' in errors && errors.changed}
                    onChange={event => setChanged(event.target.value)} />
                <FormInput
                    id="password-repeat-input"
                    data-test-id="password-repeat-input"
                    label="New Password (Repeated)"
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

export default AuthChangePassword;
