import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Icon, IconButton, ListItem, ListItemText, ListItemSecondaryAction, Modal, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    FacebookShareButton,
    TwitterShareButton,
    EmailShareButton,
  } from 'react-share';

import classNames from 'classnames';

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
    const [open, setOpen] = React.useState(false);

    const dispatch = useDispatch();
    const userBookmarks = useSelector(state => state.user.bookmarks);
    const auth = useSelector(state => state.auth);
    const uid = post.uid;
    const [bookmark, setBookmark] = useState(userBookmarks.indexOf(uid) !== -1);

    const prevBookmark = useRef(bookmark);
    useEffect(() => {
        if (prevBookmark !== bookmark) {
            setBookmark(userBookmarks.indexOf(uid) !== -1);
            prevBookmark.current = bookmark;
        }
    }, [userBookmarks, bookmark, uid]);

    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleBookmark = () => {
        const action = bookmark ? deleteBookmark : postBookmark;
        setBookmark(!bookmark);
        dispatch(action({ uid: uid }));
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
                <Modal
                    aria-labelledby={`modal-title-${post.uid}`}
                    open={open}
                    onClose={handleClose}>
                    <div className={classes.modal}>
                        <Typography id={`modal-title-${post.uid}`} gutterBottom>
                            {post.title}
                        </Typography>
                        <Typography gutterBottom>
                            Share Via
                        </Typography>
                        <div className={classes.shareIcons}>
                            <TwitterShareButton
                                url={post.link}
                                title={post.title}>
                                <Icon fontSize="large" className="fab fa-twitter-square" />
                            </TwitterShareButton>
                            <FacebookShareButton
                                url={post.link}
                                quote={post.title}>
                                <Icon fontSize="large" className="fab fa-facebook-square" />
                            </FacebookShareButton>
                            <EmailShareButton
                                url={post.link}
                                subject={post.title}
                                body={post.title}>
                                <Icon fontSize="large" className="fas fa-envelope" />
                            </EmailShareButton>
                        </div>
                    </div>
                </Modal>
                {auth && (
                    <ListItemSecondaryAction>
                        <IconButton onClick={handleOpen} color="primary">
                            <Icon fontSize="small" className={classNames('fas fa-share-alt')} />
                        </IconButton>
                        <IconButton onClick={handleBookmark} color="primary">
                            {bookmark ? (
                                <Icon fontSize="small" className={classNames('fas fa-bookmark')} />
                            ) : (
                                <Icon fontSize="small" className={classNames('far fa-bookmark')} />
                            )}
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
        </React.Fragment>
    );
}

export default PostListItem;
