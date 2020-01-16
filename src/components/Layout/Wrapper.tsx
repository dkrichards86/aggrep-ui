import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import {
    AppBar, Button, Divider, Hidden, Icon, IconButton, Menu, MenuItem, Snackbar, SnackbarContent,
    Toolbar, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import WrapperDrawer from "components/Layout/WrapperDrawer";

import { postAuthEmailConfirmRequest, fetchLogout, clearAlert } from 'store/actions';
import { RootState } from 'store/reducers';
import { useSelector } from 'store/types'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    title: {
        fontFamily: 'Quicksand',
        fontSize: '1.5rem',
        textDecoration: 'none',
        flex: 1,
        '& strong': {
            fontWeight: 500
        },
    },
    appBar: {
        width: '100%',
        zIndex: theme.zIndex.drawer + 1
    },
    toolbar: theme.mixins.toolbar,
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    main: {
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(3),
        },
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        minWidth: 0,
    },
    snackbar: {
        backgroundColor: theme.palette.primary.main,
    },
    closeIcon: {
        fontSize: 20,
    },
    headIcon: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
        width: 'auto'
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

interface WrapperProps {
    children: React.ReactNode;
};

const Wrapper: React.FunctionComponent<WrapperProps> = ({ children }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const pageNumber = useSelector((state: RootState) => state.posts.page);
    const alert = useSelector((state: RootState) => state.alert);
    const auth = useSelector((state: RootState) => state.auth);
    const hydrating = useSelector((state: RootState) => state.hydrating);
    const [menuAnchor, setAnchor] = useState<null | HTMLButtonElement>(null);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        handleClose();
        setMobileOpen(false);
    }, [pathname, pageNumber]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
        setAnchor(event.currentTarget);
    };

    const handleClose = ():void => {
        setAnchor(null);
    };

    let rightAction = null;
    if (!hydrating && auth) {
        rightAction = (
            <React.Fragment>
                <Hidden smUp implementation="css">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        aria-controls="user-menu"
                        aria-haspopup="true"
                        onClick={handleClick}>
                        <Icon className="fas fa-user-circle" />
                    </IconButton>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Button
                        aria-controls="user-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        color="inherit">
                        {auth.user.email}
                    </Button>
                </Hidden>
                <Menu
                    id="user-menu"
                    anchorEl={menuAnchor}
                    keepMounted
                    open={Boolean(menuAnchor)}
                    onClose={handleClose}>
                    <MenuItem component={Link} to='/manage/categories'>Manage Categories</MenuItem>
                    <MenuItem component={Link} to='/manage/sources'>Manage Sources</MenuItem>
                    <Divider />
                    <MenuItem component={Link} to='/update-email'>Update Email Address</MenuItem>
                    <MenuItem component={Link} to='/update-password'>Update Password</MenuItem>
                    {!auth.user.confirmed && (
                        <MenuItem onClick={() => dispatch(postAuthEmailConfirmRequest())}>Confirm Email</MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={() => dispatch(fetchLogout())}>Sign Out</MenuItem>
                </Menu>
            </React.Fragment>
        );
    } else if (!hydrating) {
        rightAction = (
            <React.Fragment>
                <Button size="small" variant="outlined" color="inherit" component={Link} to='/login'>
                    Sign In
                </Button>
            </React.Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar} color="primary">
                <Toolbar>
                    <Hidden smUp implementation="css">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setMobileOpen(!mobileOpen)}>
                            <Icon className={classNames('fas fa-bars', classes.headIcon)} />
                        </IconButton>
                    </Hidden>
                    <Typography color='inherit' className={classes.title}>
                        <span>aggregate</span> <strong>report</strong>
                    </Typography>
                    {rightAction}
                </Toolbar>
            </AppBar>
            <WrapperDrawer open={mobileOpen} handleToggle={() => setMobileOpen(!mobileOpen)} />
            <main className={classes.main}>
                <div className={classes.toolbar} />
                {children}
                {alert && (
                    <Snackbar
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                        autoHideDuration={3000}
                        open={true}
                        onClose={() => dispatch(clearAlert())}>
                        <SnackbarContent
                            className={classes.snackbar}
                            aria-describedby="client-snackbar"
                            message={
                                <span id="client-snackbar" className={classes.message}>
                                    {alert.type === 'info' ? (
                                        <Icon fontSize='small' className={classNames('fas fa-info', classes.headIcon)} />
                                    ) : (
                                        <Icon fontSize='small' className={classNames('fas fa-exclamation-triangle', classes.headIcon)} />
                                    )}
                                    {alert.message || 'Something went wrong.'}
                                </span>
                            }
                            action={[
                                <IconButton
                                    key="close"
                                    aria-label="close"
                                    color="inherit"
                                    onClick={() => dispatch(clearAlert())}>
                                    <Icon className={classNames('fas fa-times', classes.closeIcon)} />
                                </IconButton>
                            ]}/>
                    </Snackbar>
                )}
            </main>
        </div>
    );
};

export default Wrapper;
