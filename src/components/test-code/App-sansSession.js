import React, { Component } from 'react';
import '../css/App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from './auth/Routes';
import { withFirebase } from './auth/firebase/context';

// pour la gestion plus simple des sessions:
import { AuthUserContext } from './session/Session-index';

// lister et importer les components contenu de page : 
import Navigation from './Navigation';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import SignUpPage from './auth/Signup';
import SignInPage from './auth/Signin';
import Account from './Account';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
    };
  }

  // Lorsque le component a été monté on ajoute le state dépendant de l'authentification en props 
  // en écoutant l'evenement d'état d'authentification qui change et recoit une fonction en paramètre
  // cette fonction est appelée à chaque fois que le state change
  // la déconnexion signout change l'objet authUser qui devient null et le state aussi
  // pour des questions de performance l'écouteur d'évenement sera supprimé si le component n'est pas monté/chargé
  componentDidMount() {
    //this.props.firebase.auth.onAuthStateChanged(authUser => {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    },
   );
  }

  // désactive l'event lorsque le component changera
  componentWillUnmount() {
    this.listener();
  }


  /* 
     Le component de navigation prend l'identification en state 
     pour afficher du contenu en fonction de ce state/identification 

     chaque component route charge le contenu de la route indiquée dans auth/Routes.js 
     que l'on associe à Route de react-router-dom

     autuserContext va utiliser le component de session pour eviter de passer par trop de component 
     pour gérer les contenus liés à auth
  */

  render() {
    return (
    <AuthUserContext.Provider value={this.state.authUser}>
    <div className="App">
      <header className="App-header">
		<Router>
	    		{/* plus besoin de passer auth dans navigation car la balise authusercontext 
			s'en charge
			<Navigation authUser={this.state.authUser} />*/}
			<Navigation/>
			<Route exact path={ROUTES.LANDING} component={LandingPage} />
			<Route path={ROUTES.HOME} component={HomePage} />
			<Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      			<Route path={ROUTES.SIGN_IN} component={SignInPage} />
			<Route path={ROUTES.ACCOUNT} component={Account} />
	  	</Router>
      </header>
    </div>
    </AuthUserContext.Provider>
    );
  }
}

export default withFirebase(App);
