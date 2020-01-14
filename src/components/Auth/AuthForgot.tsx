import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Form from 'components/Common/Form';
import FormButton from 'components/Common/FormButton';
import FormButtonGroup from 'components/Common/FormButtonGroup';
import FormInput from 'components/Common/FormInput';
import ViewTitle from 'components/Common/ViewTitle';
import { postAuthPasswordReset } from 'store/actions';
import { SubmissionErrorsType } from 'store/types';

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

const authResetErrors:SubmissionErrorsType = {
    email: '',
};

const AuthReset:React.FunctionComponent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [errors, setErrors] = useState<SubmissionErrorsType>({...authResetErrors});

    const clear = ():void => {
        setEmail('');
        setErrors({...authResetErrors});
    };

    const submit = async () => {
        const submissionErrors = {...authResetErrors};
        let isValid = true;

        if (isBlank(email)) {
            submissionErrors.email = 'This field is required.';
            isValid = false;
        } else if (!isEmail(email)) {
            submissionErrors.email = 'Invalid email address provided.';
            isValid = false;
        }

        if (isValid) {
            setErrors({...authResetErrors});
            try {
                await dispatch(postAuthPasswordReset({ email }));
                history.push("/");
            } catch {}
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