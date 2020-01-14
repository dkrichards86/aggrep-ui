import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from "react-redux";
import isEqual from 'lodash/isEqual'
import {
    MenuItem, FormControl, Select
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { setFilter } from 'store/actions';
import { RootState } from 'store/reducers';
import { useSelector } from 'store/types'

const useStyles = makeStyles(() => ({
    formControl: {
        minWidth: 120,
    },
}));

const SORT_OPTIONS = [
    {key: 'popular', value: 'Popular'},
    {key: 'latest', value: 'Latest'}
];

const PostSort:React.FunctionComponent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const sort = useSelector((state: RootState) => state.filters.sort);
    const [sortState, setSort] = useState<unknown | string>('latest');

    const prevList = useRef(sortState);
    useEffect(() => {
        if (!isEqual(sortState, prevList.current)) {
            setSort(sortState);
        } else if (!isEqual(sort, sortState)) {
            setSort(sort);
            prevList.current = sort;
        }
    }, [sort, sortState]);

    const handleChange = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>):void => {
        const value = e.target.value;
        setSort(value);
        dispatch(setFilter('sort', value));
    };

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
