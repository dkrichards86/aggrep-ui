import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import { postMangeCategories } from "store/actions";
import {
  Button, Paper, List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ViewTitle from 'components/Common/ViewTitle';

import { RootState } from 'store/reducers';
import { CategoryType, useSelector } from 'store/types';

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

const ManageCategories = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const categories = useSelector((state: RootState) => state.categories);
    const userCategories = useSelector((state: RootState) => state.user.categories);
    const [checked, setChecked] = useState<Array<number>>([]);

    const prevList = useRef(checked);
    useEffect(() => {
        if (!isEqual(checked, prevList.current)) {
            setChecked(checked);
        } else if (!isEqual(checked, userCategories)) {
            setChecked(userCategories);
            prevList.current = userCategories;
        }
    }, [checked, userCategories]);

    const reset = ():void => {
        setChecked(userCategories);
    };

    const submit = ():void => {
        const excluded = categories.map((c: CategoryType):number => c.id).filter((x: number):boolean => checked.indexOf(x) === -1);
        const payload = { excluded_categories: excluded };
        dispatch(postMangeCategories(payload));
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

    return (
        <div className={classes.root}>
            <ViewTitle title="Manage your Preferred Categories" />
            <Typography gutterBottom>
                Choose preferred categories from the list below. Excluded categories will be
                omitted from your home page and any source pages.
            </Typography>
            <Paper>
                <List dense>
                {categories.map((cat: CategoryType):React.ReactNode => (
                    <React.Fragment>
                        <ListItem key={cat.slug} button>
                            <ListItemIcon>
                                <Checkbox
                                    edge="end"
                                    onChange={handleToggle(cat.id)}
                                    checked={checked.indexOf(cat.id) !== -1}
                                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${cat.slug}` }}
                                />
                            </ListItemIcon>
                            <ListItemText id={`checkbox-list-label-${cat.slug}`} primary={cat.title} />
                        </ListItem>
                    </React.Fragment>
                ))}
                </List>
                <br />
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

export default ManageCategories;
