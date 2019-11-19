import cloneDeep from 'lodash/cloneDeep';
import isNil from 'lodash/isNil';

const defaultParams = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

export const getConfig = () => ({
    method: 'GET',
    credentials: 'omit',
    ...defaultParams,
});

export const postConfig = (data) => ({
    method: 'POST',
    credentials: 'omit',
    ...defaultParams,
    body: data ? JSON.stringify(data) : null,
});

export const deleteConfig = (data) => ({
    method: 'DELETE',
    credentials: 'omit',
    ...defaultParams,
    body: data ? JSON.stringify(data) : null,
});

export const fetcher = (apiUrl, config) => {
    let success;
    return new Promise( (resolve, reject) => {
        fetch(apiUrl, config)
            .then(r => {
                success = r.ok;
                return r.json();
            })
            .then(data => {
                if (!success) {
                    reject(data);
                }
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const withAuthToken = (fetchOpts, token) => {
    let fetchOptsWithAuth = cloneDeep(fetchOpts);
    fetchOptsWithAuth.headers = fetchOptsWithAuth.headers || {};

    if (!isNil(token)) {
        fetchOptsWithAuth.headers['Authorization'] = `Bearer ${token}`;
    }

    return fetchOptsWithAuth;
};