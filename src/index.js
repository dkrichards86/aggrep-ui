import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ConnectedRouter, LOCATION_CHANGE } from 'connected-react-router'
import { createMiddleware } from 'redux-beacon';
import GoogleAnalyticsGtag, { trackPageView } from '@redux-beacon/google-analytics-gtag';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Wrapper from "components/Layout/Wrapper";

import './index.css';
import "@fortawesome/fontawesome-free/css/all.css";
import 'typeface-roboto';
import 'typeface-quicksand';
import Routes from './router/Routes';
import reducers from "store/reducers";
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

export const history = createBrowserHistory();

const eventsMap = {
    [LOCATION_CHANGE]: trackPageView(action => ({
        page: action.payload.pathname,
    })),
};

const TRACKING_ID = 'G-M447707EYQ';
const GA = GoogleAnalyticsGtag(TRACKING_ID);
const gaMiddleware = createMiddleware(eventsMap, GA);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducers(history), composeEnhancers(applyMiddleware(thunkMiddleware, gaMiddleware))
);

store.dispatch(hydrateStore());

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <BrowserRouter>
                <MuiThemeProvider theme={theme}>
                    <Wrapper>
                        <Routes />
                    </Wrapper>
                </MuiThemeProvider>
            </BrowserRouter>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register();