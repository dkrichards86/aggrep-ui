import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Form from 'components/Common/Form';
import FormButton from 'components/Common/FormButton';
import FormButtonGroup from 'components/Common/FormButtonGroup';
import FormInput from 'components/Common/FormInput';
import ViewTitle from 'components/Common/ViewTitle';
import { postAuthEmailUpdate } from 'store/actions';
import { SubmissionErrorsType } from 'store/types';
import { isBlank, isEmail } from 'utils';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 800,
        margin: '0 auto'
    },
}));

const authUpdateEmailErrors:SubmissionErrorsType = {
    email: '',
};

const AuthUpdateEmail:React.FunctionComponent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [errors, setErrors] = useState<SubmissionErrorsType>({...authUpdateEmailErrors});

    const clear = ():void => {
        setEmail('');
        setErrors({...authUpdateEmailErrors});
    };

    const submit = async () => {
        const submissionErrors = {...authUpdateEmailErrors};
        let isValid = true;

        if (isBlank(email)) {
            submissionErrors.email = 'This field is required.';
            isValid = false;
        } else if (!isEmail(email)) {
            submissionErrors.email = 'Invalid email address provided.';
            isValid = false;
        }

        if (isValid) {
            setErrors({...authUpdateEmailErrors});
            try {
                await dispatch(postAuthEmailUpdate({ email }));
                history.push("/");
            } catch {}
        }
        else {
            setErrors(submissionErrors)
        }
    };

    return (
        <div className={classes.root}>
            <ViewTitle title="Update your Email Address" data-test-id="view-title" />
            <Form onEnterKey={() => submit()}>
                <FormInput
                    id="email-input"
                    data-test-id="email-input"
                    label="Email Address"
                    type="email"
                    value={email}
                    helperText={'email' in errors && errors.email}
                    error={!!errors.email}
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

export default AuthUpdateEmail;