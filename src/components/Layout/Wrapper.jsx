import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import {
    AppBar, Button, Divider, Hidden, Icon, IconButton, Menu, MenuItem, Snackbar, SnackbarContent,
    Toolbar, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import WrapperDrawer from "components/Layout/WrapperDrawer";

import { postAuthEmailConfirmRequest, fetchLogout, clearAlert } from 'store/actions';

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

const Layout = ({ children }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const auth = useSelector(state => state.auth);
    const alert = useSelector(state => state.alert);
    const isHydrating = useSelector(state => state.hydrating);
    const [menuAnchor, setAnchor] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        handleClose();
    }, [pathname]);

    const handleClick = event => {
        setAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setAnchor(null);
    };

    let rightAction = null;
    if (!isHydrating && auth) {
        rightAction = (
            <React.Fragment>
                <Button
                    aria-controls="user-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    color="inherit">
                    <Hidden smUp implementation="css">
                        <Icon className="fas fa-user-circle" />
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        {auth.user.email}
                    </Hidden>
                </Button>
                <Menu
                    id="user-menu"
                    anchorEl={menuAnchor}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
     } else if (!isHydrating) {
        rightAction = (
            <React.Fragment>
                <Button color="inherit" component={Link} to='/register'>
                    Sign Up
                </Button>
                <Button variant="outlined" color="inherit" component={Link} to='/login'>
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
                    <Typography variant="h1" color="inherit" component={Link} to="/" className={classes.title}>
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
}

export default Layout;
