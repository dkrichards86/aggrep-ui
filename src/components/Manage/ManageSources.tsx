import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import isEqual from 'lodash/isEqual'
import { postMangeSources } from "store/actions";
import {
  Button, Paper, List, ListItem, ListItemIcon, ListItemText, Checkbox, TablePagination, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ViewTitle from 'components/Common/ViewTitle';

import { RootState } from 'store/reducers';
import { SourceType, useSelector } from 'store/types';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1024,
        margin: '0 auto'
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        margin: theme.spacing(3, 1, 1),
    }
}));

const ManageSources = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const sources = useSelector((state: RootState) => state.sources);
    const userSources = useSelector((state: RootState) => state.user.sources);
    const [checked, setChecked] = useState<Array<number>>([]);
    const [page, setPage] = useState<number>(0);
    const perPage = 10;

    const prevList = useRef(checked);
    useEffect(() => {
        if (!isEqual(checked, prevList.current)) {
            setChecked(checked);
        } else if (!isEqual(checked, userSources)) {
            setChecked(userSources);
            prevList.current = userSources;
        }
    }, [checked, userSources])

    const reset = ():void => {
        setChecked(userSources);
    };

    const submit = ():void => {
        const excluded = sources.map((c: SourceType):number => c.id).filter((x: number):boolean => checked.indexOf(x) === -1);
        const payload = { excluded_sources: excluded };
        dispatch(postMangeSources(payload));
        history.push("/");
    };

    const handleToggle = (value: number):(() => void) => ():void => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const slice = sources.slice(page * perPage, (page*perPage) + perPage);

    return (
        <div className={classes.root}>
            <ViewTitle title="Manage your Preferred Sources" />
            <Typography gutterBottom>
                Choose preferred news sources from the list below. Excluded sources will be
                omitted from your home page and any category pages.
            </Typography>
            <Paper>
                <List dense>
                {slice.map((src: SourceType):React.ReactNode => (
                    <React.Fragment>
                        <ListItem key={src.slug} button>
                            <ListItemIcon>
                                <Checkbox
                                    edge="end"
                                    onChange={handleToggle(src.id)}
                                    checked={checked.indexOf(src.id) !== -1}
                                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${src.slug}` }}
                                />
                            </ListItemIcon>
                            <ListItemText id={`checkbox-list-label-${src.slug}`} primary={src.title} />
                        </ListItem>
                    </React.Fragment>
                ))}
                </List>
                <TablePagination
                    component="div"
                    count={sources.length}
                    page={page}
                    rowsPerPage={perPage}
                    backIconButtonProps={{
                        'aria-label': 'previous page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'next page',
                    }}
                    onChangePage={(_, newPage) => setPage(newPage)}
                />
                <div className={classes.buttonGroup}>
                    <Button color="primary" onClick={() => reset()} className={classes.button}>
                        Reset
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => submit()} className={classes.button}>
                        Submit
                    </Button>
                </div>
            </Paper>
        </div>
    );
}

export default ManageSources;
