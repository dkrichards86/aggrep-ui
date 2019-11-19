import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

import AuthLogin from 'components/Auth/AuthLogin';
import AuthForgot from 'components/Auth/AuthForgot';
import AuthReset from 'components/Auth/AuthReset';
import AuthRegister from 'components/Auth/AuthRegister';
import AuthChangePassword from 'components/Auth/AuthChangePassword';
import AuthConfirmEmail from 'components/Auth/AuthConfirmEmail';
import AuthUpdateEmail from 'components/Auth/AuthUpdateEmail';
import ManageCategories from'components/Manage/ManageCategories';
import ManageSources from 'components/Manage/ManageSources';
import Posts from 'components/Posts/Posts';

const AuthRoute = ({ component: Component, authenticated, redirectTo, ...rest}) => (
    <Route
        {...rest}
        render={props => (
            authenticated ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: redirectTo, state: { from: props.location } }} />
            )
         )}/>
);

const UnauthRoute = ({ component: Component, authenticated, redirectTo, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            authenticated ? (
                <Redirect to={{ pathname: redirectTo, state: { from: props.location }}}/>
            ) : (
                <Component {...props} />
            )
        )}/>
);

const Categories = (props) => <Posts {...props} endpoint="category" />;
const Sources = (props) => <Posts {...props} endpoint="source" />;
const SimilarPosts = (props) => <Posts {...props} endpoint="similar" hideSort />;
const Bookmarks = (props) => <Posts {...props} endpoint="bookmarks" hideSort />;

const Routes = () => {
    const isAuthenticated = useSelector(state => !!state.auth); 
    
    return (
        <div>
            <Route
                exact
                path="/"
                component={Posts} />
            <Route
                path="/category/:slug"
                component={Categories} />
            <Route
                path="/source/:slug"
                component={Sources} />
            <Route
                path="/similar/:slug"
                component={SimilarPosts} />
            <AuthRoute
                path="/bookmarks"
                component={Bookmarks} 
                redirectTo="/login"
                authenticated={isAuthenticated} />
            <AuthRoute
                path="/manage/categories"
                component={ManageCategories} 
                redirectTo="/login"
                authenticated={isAuthenticated} />
            <AuthRoute
                path="/manage/sources"
                component={ManageSources}
                redirectTo="/login"
                authenticated={isAuthenticated} />
            <UnauthRoute
                exact path="/login"
                component={AuthLogin}
                redirectTo="/"
                authenticated={isAuthenticated} />
            <UnauthRoute
                exact path="/register"
                component={AuthRegister}
                redirectTo="/"
                authenticated={isAuthenticated} />
            <UnauthRoute
                exact path="/forgot"
                component={AuthForgot}
                redirectTo="/"
                authenticated={isAuthenticated} />
            <UnauthRoute
                exact path="/reset/:token"
                component={AuthReset} 
                redirectTo="/"
                authenticated={isAuthenticated} />
            <AuthRoute
                exact path="/update-email"
                component={AuthUpdateEmail} 
                redirectTo="/"
                authenticated={isAuthenticated} />
            <AuthRoute
                exact path="/update-password"
                component={AuthChangePassword} 
                redirectTo="/"
                authenticated={isAuthenticated} />
            <Route
                path="/email/confirm/:token"
                component={AuthConfirmEmail} />
        </div>
    );
};

export default withRouter(Routes);
