import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Wrapper from "components/Layout/Wrapper";

import './index.css';
import "@fortawesome/fontawesome-free/css/all.css";
import 'typeface-roboto';
import 'typeface-quicksand';
import Routes from './router/Routes';
import reducer, { initialState as preloadedState } from "store/reducers";
import { hydrateStore } from 'store/actions';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#60748b',
            main: '#34495E',
            dark: '#092234',
            contrastText: '#FFF',
        },
        secondary: {
            light: '#60748b',
            main: '#34495E',
            dark: '#092234',
            contrastText: '#FFF',
        },
    }
});

const TRACKING_ID = 'G-M447707EYQ';
ReactGA.initialize(TRACKING_ID);

export const history = createBrowserHistory();
history.listen(location => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
});

const middleware = [...getDefaultMiddleware()];

const store = configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
});

store.dispatch<any>(hydrateStore());
ReactGA.pageview(window.location.pathname);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <MuiThemeProvider theme={theme}>
                <Wrapper>
                    <Routes />
                </Wrapper>
            </MuiThemeProvider>
        </Router>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register();