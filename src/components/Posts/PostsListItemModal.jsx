import React from 'react';
import { useDispatch } from "react-redux";
import {
    Divider, Icon, Modal, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { setAlert } from 'store/actions';

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
        margin: theme.spacing(1),
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
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
    copyIcon: {
        color: "#AAAAAA"
    }
}));

const shareLink = (post) => post.post_url;
const shareTitle = (post) => `${post.title} - ${post.feed.source.title}`;

const ShareItemTwitter = ({post, classes}) => {
    return (
        <TwitterShareButton
            url={shareLink(post)}
            title={shareTitle(post)}
            via="AggregateReport"
            className={classes.shareIcon}
            data-test-id="share-link-twitter">
            <Icon
                fontSize="small"
                data-test-id="share-icon-twitter"
                className={classNames('fab fa-twitter', classes.twitterIcon)} />
        </TwitterShareButton>
    );
};

const ShareItemFacebook = ({post, classes}) => {
    return (
        <FacebookShareButton
            url={shareLink(post)}
            className={classes.shareIcon}
            data-test-id="share-link-facebook">
            <Icon
                fontSize="small"
                data-test-id="share-icon-facebook"
                className={classNames('fab fa-facebook', classes.facebookIcon)} />
        </FacebookShareButton>
    );
};

const ShareItemLinkedin = ({post, classes}) => {
    return (
        <LinkedinShareButton
            url={shareLink(post)}
            className={classes.shareIcon}
            data-test-id="share-link-linkedin">
            <Icon
                fontSize="small"
                data-test-id="share-icon-linkedin"
                className={classNames('fab fa-linkedin-in', classes.linkedinIcon)} />
        </LinkedinShareButton>
    );
};

const ShareItemReddit = ({post, classes}) => {
    return (
        <RedditShareButton
            url={shareLink(post)}
            title={post.title}
            className={classes.shareIcon}
            data-test-id="share-link-reddit">
            <Icon
                fontSize="small"
                data-test-id="share-icon-reddit"
                className={classNames('fab fa-reddit', classes.redditIcon)} />
        </RedditShareButton>
    );
};

const ShareItemEmail = ({post, classes}) => {
    const body = `Take a look at this article via https://www.aggregatereport.com.`
    return (
        <EmailShareButton
            url={shareLink(post)}
            subject={shareTitle(post)}
            body={body}
            openWindow={true}
            className={classes.shareIcon}
            data-test-id="share-link-email">
            <Icon
                fontSize="small"
                data-test-id="share-icon-email"
                className={classNames('fa fa-envelope', classes.emailIcon)} />
        </EmailShareButton>
    );
};

const ShareItemClipboard = ({post, classes}) => {
    const dispatch = useDispatch();

    return (
        <CopyToClipboard
            text={shareLink(post)}
            onCopy={() => dispatch(setAlert({ message: 'Link copied!', type: 'INFO' }))}
            data-test-id="share-link-clipboard">
            <Icon
                component='span'
                fontSize="small"
                data-test-id="share-icon-clipboard"
                className={classNames('fa fa-link', classes.shareIcon, classes.copyIcon)} />
        </CopyToClipboard>
    );
};

const PostListItemModal = ({ post, onClose }) => {
    const classes = useStyles();

    const supportsCopy = "queryCommandSupported" in document && document.queryCommandSupported;

    return (
        <Modal
            aria-labelledby={`modal-title-${post.uid}`}
            open={true}
            onClose={onClose}
            data-test-id="share-modal">
            <div className={classes.modal}>
                <Typography
                    variant="h5"
                    gutterBottom
                    data-test-id="share-modal-title">
                    Share Link
                </Typography>
                <Typography
                    id={`modal-title-${post.uid}`}
                    data-test-id="share-modal-link"
                    gutterBottom>
                    {shareTitle(post)}
                </Typography>
                <Divider />
                <div className={classes.shareIcons}>
                    <ShareItemTwitter post={post} classes={classes} />
                    <ShareItemFacebook post={post} classes={classes} />
                    <ShareItemLinkedin post={post} classes={classes} />
                    <ShareItemReddit post={post} classes={classes} />
                    <ShareItemEmail post={post} classes={classes} />
                    {supportsCopy && <ShareItemClipboard post={post} classes={classes} />}
                </div>
            </div>
        </Modal>
    );
}

export default PostListItemModal;
