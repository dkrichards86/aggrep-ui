import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Icon, IconButton, ListItem, ListItemText, ListItemSecondaryAction, Menu, MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import classNames from 'classnames';

import PostsListItemModal from 'components/Posts/PostsListItemModal';
import { postBookmark, deleteBookmark } from 'store/actions';

const useStyles = makeStyles(theme => ({
    modal: {
        position: 'absolute',
        width: 280,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        padding: theme.spacing(2, 4, 3),
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        textAlign: 'center'
    },
    shareIcons: {
        display: 'flex',
        justifyContent: 'space-around'
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
    },
    postDetails: {
        fontSize: "0.8rem",
        color: theme.palette.text.secondary,
        width: '100%',
        marginTop: theme.spacing(1),
    },
    detailLink: {
        textDecoration: 'none',
        color: theme.palette.text.secondary,
    }
}));

const PostListItem = ({ post }) => {
    const classes = useStyles();
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const userBookmarks = useSelector(state => state.app.user.bookmarks);
    const auth = useSelector(state => state.app.auth);
    const uid = post.uid;
    const [bookmark, setBookmark] = useState(userBookmarks.indexOf(uid) !== -1);

    const prevBookmark = useRef(bookmark);
    useEffect(() => {
        if (prevBookmark !== bookmark) {
            setBookmark(userBookmarks.indexOf(uid) !== -1);
            prevBookmark.current = bookmark;
        }
    }, [userBookmarks, bookmark, uid]);

    const handleModalOpen = () => {
        setModalOpen(true);
        handleMenuClose();
    };
    
    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleMenuOpen = event => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleBookmark = () => {
        if (auth) {
            const action = bookmark ? deleteBookmark : postBookmark;
            setBookmark(!bookmark);
            dispatch(action({ uid: uid }));
        } else {
            history.push("/login");
        }
    };

    const postTitle = (
        <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
            dangerouslySetInnerHTML={{__html: post.title}} />
    );

    let similarLink = null;
    if (post.similar_count > 1) {
        similarLink = (
            <React.Fragment>
                &nbsp;&bull;&nbsp;
                <Link to={`/similar/${post.uid}`} className={classes.detailLink}>
                    Related Posts
                </Link>
            </React.Fragment>
        );
    }

    const secondary = (
        <span className={classes.postDetails}>
            {moment(post.published_datetime).fromNow()}
            &nbsp;&bull;&nbsp;
            <Link to={`/source/${post.feed.source.slug}`} className={classes.detailLink}>
                {post.feed.source.title}
            </Link>
            &nbsp;&bull;&nbsp;
            <Link to={`/category/${post.feed.category.slug}`} className={classes.detailLink}>
                {post.feed.category.title}
            </Link>
            {similarLink}
        </span>
    )

    return (
        <React.Fragment>
            <ListItem>
                <ListItemText primary={postTitle} secondary={secondary} />
                    <ListItemSecondaryAction>
                        <IconButton onClick={handleMenuOpen} color="primary">
                            <Icon fontSize="small" className={classNames('fas fa-ellipsis-v')} />
                        </IconButton>
                    </ListItemSecondaryAction>
            </ListItem>
            {modalOpen && <PostsListItemModal post={post} onClose={handleModalClose} />}
            <Menu
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}>
                <MenuItem component='a' href={post.link}>View Article</MenuItem>
                <MenuItem onClick={handleModalOpen}>
                    Share Article
                </MenuItem>
                <MenuItem onClick={handleBookmark}>
                    {bookmark ? "Remove Bookmark" : "Bookmark"}
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}

export default PostListItem;
