import React, { useState } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import get from 'lodash/get';
import Form from 'components/Common/Form';
import FormButton from 'components/Common/FormButton';
import FormButtonGroup from 'components/Common/FormButtonGroup';
import FormInput from 'components/Common/FormInput';
import ViewTitle from 'components/Common/ViewTitle';
import { postAuthPasswordResetConfirm } from 'store/actions';
import { SubmissionErrorsType } from 'store/types';
import { isBlank } from 'utils';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 800,
        margin: '0 auto'
    }
}));

const authResetErrors:SubmissionErrorsType = {
    confirmed: '',
    changed: ''
};

const AuthReset:React.FunctionComponent<RouteComponentProps> = ({match}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [changed, setChanged] = useState<string>('');
    const [confirmed, setConfirmed] = useState<string>('');
    const [errors, setErrors] = useState<SubmissionErrorsType>({...authResetErrors});

    const clear = ():void => {
        setChanged('')
        setConfirmed('');
        setErrors({...authResetErrors});
    };

    const submit = async () => {
        const submissionErrors = {...authResetErrors};
        let isValid = true;

        if (isBlank(changed)) {
            submissionErrors.changed = 'This field is required.';
            isValid = false;
        }

        if (isBlank(confirmed)) {
            submissionErrors.confirmed = 'This field is required.';
            isValid = false;
        }

        if (confirmed !== changed) {
            const msg = "The passwords must match."
            submissionErrors.confirmed = msg;
            submissionErrors.changed = msg;
            isValid = false;
        }

        if (isValid) {
            setErrors({...authResetErrors});
            const token = get(match.params, 'token', null);
            const payload = {
                token: token, new_password: changed, password_confirm: confirmed
            };
            try {
                await dispatch(postAuthPasswordResetConfirm(payload));
                history.push("/login");
            } catch {}
        }
        else {
            setErrors(submissionErrors)
        }
    };

    return (
        <div className={classes.root}>
            <ViewTitle title="Reset your Password" data-test-id="view-title" />
            <Form onEnterKey={() => submit()}>
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

export default AuthReset;