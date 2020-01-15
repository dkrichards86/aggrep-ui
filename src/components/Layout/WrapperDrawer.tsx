import React from 'react';
import { useDispatch } from "react-redux";
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { 
    Divider, Drawer, Hidden, Icon, List, ListItem, ListItemText, ListItemIcon
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { getPosts } from 'store/actions';
import { RootState } from 'store/reducers';
import { CategoryType, useSelector } from 'store/types';

const DRAWER_WIDTH = 280;

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: DRAWER_WIDTH,
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
    },
    drawerLink: {
        color: 'inherit'
    },
    icon: {
        color: theme.palette.primary.main,
        width: 'auto',
        margin: '0 auto'
    }
}));

interface iconOption {
    [key: string]: string
};

const ICON_MAP:iconOption = {
    news: 'fa-newspaper',
    business: 'fa-fax',
    technology: 'fa-sim-card',
    sports: 'fa-table-tennis',
    entertainment: 'fa-film',
    health: 'fa-heartbeat',
    science: 'fa-flask',
};

interface WrapperDrawerProps {
    open: boolean;
    handleToggle: any;
};

const WrapperDrawer: React.FunctionComponent<WrapperDrawerProps> = ({ open, handleToggle }) => {
    const classes = useStyles();
    const auth = useSelector((state: RootState) => state.auth);
    const categories = useSelector((state: RootState) => state.categories);
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const handleCategoryClick = (to: string):void => {
        if (pathname === to) {
            dispatch(getPosts());
        }
    };

    const content = (
        <List component="nav">
            <ListItem
                component={Link} 
                className={classes.drawerLink}
                to="/">
                <ListItemIcon>
                    <Icon
                        fontSize="small"
                        className={classNames('fas fa-home', classes.icon)} />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItem>
            <Divider />
            {categories.map((c: CategoryType):React.ReactNode => (
                <ListItem
                    key={`drawer-category-${c.slug}`}
                    component={Link} 
                    className={classes.drawerLink}
                    onClick={() => handleCategoryClick(`/category/${c.slug}`)}
                    to={`/category/${c.slug}`}>
                    <ListItemIcon>
                        <Icon
                            fontSize="small"
                            className={classNames('fas', ICON_MAP[c.slug], classes.icon)} />
                    </ListItemIcon>
                    <ListItemText primary={c.title} />
                </ListItem>
            ))}
            <Divider />
            <ListItem
                component={Link} 
                className={classes.drawerLink}
                to="/search">
                <ListItemIcon>
                    <Icon
                        fontSize="small"
                        className={classNames('fas fa-search', classes.icon)} />
                </ListItemIcon>
                <ListItemText primary="Search" />
            </ListItem>
            {auth && (
                <React.Fragment>
                    <Divider />
                    <ListItem
                        component={Link} 
                        className={classes.drawerLink}
                        to="/bookmarks">
                        <ListItemIcon>
                            <Icon fontSize="small" className={classNames('fas fa-bookmark', classes.icon)} />
                        </ListItemIcon>
                        <ListItemText primary="Bookmarks" />
                    </ListItem>
                    <ListItem
                        component={Link} 
                        className={classes.drawerLink}
                        to="/views">
                        <ListItemIcon>
                            <Icon fontSize="small" className={classNames('fas fa-history', classes.icon)} />
                        </ListItemIcon>
                        <ListItemText primary="Viewed Posts" />
                    </ListItem>
                </React.Fragment>
            )}
        </List>
    );

    return (
        <div className={classes.drawer}>
            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    open={open}
                    onClose={handleToggle}
                    classes={{paper: classes.drawerPaper}}
                    ModalProps={{keepMounted: true}}>
                {content}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{paper: classes.drawerPaper}}
                    variant="permanent">
                    <div className={classes.toolbar} />
                    {content}
                </Drawer>
            </Hidden>
        </div>
    );
};

export default WrapperDrawer;
