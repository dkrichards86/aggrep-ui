import React from 'react';
import {
    Divider, Icon, Modal, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import {
    FacebookShareButton,
    TwitterShareButton,
    EmailShareButton,
    LinkedinShareButton,
    RedditShareButton
  } from 'react-share';

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
    },
    shareIcons: {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-around'
    },
    twitterIcon: {
        color: "#1da1f2",
    },
    facebookIcon: {
        color: "#4267B2",
    },
    emailIcon: {
        color: "#34495E",
    },
    linkedinIcon: {
        color: "#2867b2",
    },
    redditIcon: {
        color: "#FF5700"
    },
}));

const shareLink = (post) => post.post_url;
const shareTitle = (post) => `${post.title} - ${post.feed.source.title}`;

const ShareItemTwitter = ({post, classes}) => {
    return (
        <TwitterShareButton
            url={shareLink(post)}
            title={shareTitle(post)}
            via="AggregateReport">
            <Icon
                fontSize="large"
                className={classNames('fab fa-twitter', classes.twitterIcon)} />
        </TwitterShareButton>
    );
};

const ShareItemFacebook = ({post, classes}) => {
    return (
        <FacebookShareButton url={shareLink(post)}>
            <Icon
                fontSize="large"
                className={classNames('fab fa-facebook', classes.facebookIcon)} />
        </FacebookShareButton>
    );
};

const ShareItemLinkedin = ({post, classes}) => {
    return (
        <LinkedinShareButton
            url={shareLink(post)}>
            <Icon
                fontSize="large"
                className={classNames('fab fa-linkedin-in', classes.linkedinIcon)} />
        </LinkedinShareButton>
    );
}

const ShareItemReddit = ({post, classes}) => {
    return (
        <RedditShareButton
            url={shareLink(post)}
            title={post.title}>
            <Icon
                fontSize="large"
                className={classNames('fab fa-reddit', classes.redditIcon)} />
        </RedditShareButton>
    );
}

const ShareItemEmail = ({post, classes}) => {
    const body = `Take a look at this article via https://www.aggregatereport.com.`
    return (
        <EmailShareButton
            url={shareLink(post)}
            subject={shareTitle(post)}
            body={body}
            openWindow={true}>
            <Icon
                fontSize="large"
                className={classNames('fa fa-envelope', classes.emailIcon)} />
        </EmailShareButton>
    );
};

const PostListItemModal = ({ post, onClose }) => {
    const classes = useStyles();

    return (
        <Modal
            aria-labelledby={`modal-title-${post.uid}`}
            open={true}
            onClose={onClose}>
            <div className={classes.modal}>
                <Typography gutterBottom variant="h5">
                    Share Link
                </Typography>
                <Typography id={`modal-title-${post.uid}`} gutterBottom>
                    {shareTitle(post)}
                </Typography>
                <Divider />
                <div className={classes.shareIcons}>
                    <ShareItemTwitter post={post} classes={classes} />
                    <ShareItemFacebook post={post} classes={classes} />
                    <ShareItemLinkedin post={post} classes={classes} />
                    <ShareItemReddit post={post} classes={classes} />
                    <ShareItemEmail post={post} classes={classes} />
                </div>
            </div>
        </Modal>
    );
}

export default PostListItemModal;
