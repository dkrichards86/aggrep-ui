import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Icon, IconButton, ListItem, ListItemText, ListItemSecondaryAction, Menu, MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import classNames from 'classnames';

import PostsListItemModal from 'components/Posts/PostsListItemModal';
import { postBookmark, deleteBookmark, postView } from 'store/actions';
import { RootState } from 'store/reducers';
import { PostType, useSelector } from 'store/types';

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

interface PostListItemProps {
    post: PostType;
};

const PostListItem:React.FunctionComponent<PostListItemProps> = ({ post }) => {
    const classes = useStyles();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLButtonElement>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const userBookmarks = useSelector((state: RootState) => state.user.bookmarks);
    const auth = useSelector((state: RootState) => state.auth)
    const uid = post.uid;
    const [bookmark, setBookmark] = useState<boolean>(userBookmarks.indexOf(uid) !== -1);

    const prevBookmark = useRef<boolean>(bookmark);
    useEffect(() => {
        if (prevBookmark.current !== bookmark) {
            setBookmark(userBookmarks.indexOf(uid) !== -1);
            prevBookmark.current = bookmark;
        }
    }, [userBookmarks, bookmark, uid]);

    const handleModalOpen = ():void => {
        setModalOpen(true);
        handleMenuClose();
    };
    
    const handleModalClose = ():void => {
        setModalOpen(false);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = ():void => {
        setMenuAnchor(null);
    };

    const handleBookmark = ():void => {
        if (auth) {
            const action = bookmark ? deleteBookmark : postBookmark;
            setBookmark(!bookmark);
            dispatch(action({ uid: uid }));
        } else {
            history.push("/login");
        }
    };

    const handleView = ():void => {
        if (auth) {
            dispatch(postView({ uid: uid }));
        }
    }

    const postTitle = (
        <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
            dangerouslySetInnerHTML={{__html: post.title}}
            onClick={handleView} />
    );

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
                <MenuItem component='a' href={post.link}>
                    View Article
                </MenuItem>
                <MenuItem onClick={handleModalOpen}>
                    Share Article
                </MenuItem>
                <MenuItem onClick={handleBookmark}>
                    {bookmark ? "Remove Bookmark" : "Bookmark"}
                </MenuItem>
                <MenuItem component={Link} to={`/similar/${post.uid}`}>
                    Related Coverage
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}

export default PostListItem;
