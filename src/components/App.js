//import React, { Component } from 'react';
import React from 'react';
import '../css/App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from './auth/Routes';
//import { withFirebase } from './auth/firebase/context';

// pour la gestion plus simple des sessions:
// import { AuthUserContext } from './session/Session-index';
import {withAuthentication} from './session/Session-index';

// lister et importer les components contenu de page : 
import Navigation from './Navigation';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import SignUpPage from './auth/Signup';
import SignUpAdminPage from './auth/Signup-admin';
import SignInPage from './auth/Signin';
import Account from './Account';
import Chat from './Chat';
import Admin from './auth/Admin';
import PasswordForgetPage from './auth/PasswordForget';



//class App extends Component {
  const App = () => (


  /* 
     Le component de navigation prend l'identification en state 
     pour afficher du contenu en fonction de ce state/identification 

     chaque component route charge le contenu de la route indiquée dans auth/Routes.js 
     que l'on associe à Route de react-router-dom

     autuserContext va utiliser le component de session pour éviter de passer par trop de components 
     pour gérer les contenus liés à auth
  */

  //render() {
    //return (
    <div className="container-fluid">
	<div className="row">
	    <div className="App col-12">
		<Router>
	      		<header className="">
			
		    		{/* plus besoin de passer auth dans navigation car la balise authusercontext 
				s'en chargeait puis remplacée par le component withAuthentication
				<Navigation authUser={this.state.authUser} />*/}
	      			<Navigation/>
	      		</header>
			<main>
				<Route exact path={ROUTES.LANDING} component={LandingPage} />
				<Route path={ROUTES.HOME} component={HomePage} />
				<Route path={ROUTES.SIGN_UP} component={SignUpPage} />
				<Route path={ROUTES.SIGN_UPADMIN} component={SignUpAdminPage} />
	      			<Route path={ROUTES.SIGN_IN} component={SignInPage} />
				<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
				<Route path={ROUTES.ACCOUNT} component={Account} />
				<Route path={ROUTES.ADMIN} component={Admin} />
				<Route path={ROUTES.CHAT} component={Chat} />
				{/*redirection pour les urls non valides
				<NotFoundRoute handler={require('./components/notFoundPage')} />
				<Route path='*' exact={true} component={LandingPage} />*/}
			</main>
		</Router>
	    </div>
	</div>
    </div>
    
    );
  //}
//}

//export default withFirebase(App);
// withAuthentication va s'occuper de la gestion des sessions, qui n'est plus prise en charge directement dans app
// il entoure app car il a été créé comme composant de haut niveau
// utilse le context react sans avoir besoin de props
export default withAuthentication(App);
