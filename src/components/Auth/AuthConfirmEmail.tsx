import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { RouteComponentProps } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import get from 'lodash/get';
import Form from 'components/Common/Form';
import ViewTitle from 'components/Common/ViewTitle';
import { postAuthEmailConfirmToken } from 'store/actions';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 800,
        margin: '0 auto'
    },
}));

const AuthConfirmEmail:React.FunctionComponent<RouteComponentProps> = ({match}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [confirmed, setConfirmed] = useState<boolean>(false);

    if (!confirmed) {
        const token = get(match.params, 'token', null);

        const payload = {token};
        dispatch(postAuthEmailConfirmToken(payload));
        setConfirmed(true);
    }

    return (
        <div className={classes.root}>
            <ViewTitle title="Confirm your Email" data-test-id="view-title" />
            <Form onEnterKey={() => {}}>
                <Typography>
                    {confirmed ? "Your email has been confirmed." : "Email confirmation in progress."}
                </Typography>
            </Form>
        </div>
    );
};

export default AuthConfirmEmail;