import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import isEqual from 'lodash/isEqual'
import {
    MenuItem, FormControl, Select
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { setFilter } from 'store/actions';

const useStyles = makeStyles(() => ({
    formControl: {
        minWidth: 120,
    },
}));

const SORT_OPTIONS = [
    {key: 'popular', value: 'Popular'},
    {key: 'latest', value: 'Latest'}
]

const PostSort = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const sortState = useSelector(state => state.app.filters.sort);
    const [sort, setSort] = useState('latest');

    const prevList = useRef(sort);
    useEffect(() => {
        if (!isEqual(sort, prevList.current)) {
            setSort(sort);
        } else if (!isEqual(sort, sortState)) {
            setSort(sortState);
            prevList.current = sortState;
        }
    }, [sort, sortState])

    const handleChange = (event) => {
        const value = event.target.value;
        setSort(value);
        dispatch(setFilter('sort', value));
    }

    return (
        <FormControl className={classes.formControl}>
            <Select
                value={sort}
                onChange={handleChange}
                displayEmpty
                name="sort">
                {SORT_OPTIONS.map( (opt, i) => (
                    <MenuItem
                        key={`sort_option_${i}`}
                        value={opt.key}>
                        {opt.value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default PostSort;
