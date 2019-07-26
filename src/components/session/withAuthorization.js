import React from 'react';

import { withRouter } from 'react-router-dom';
// import { compose } from 'recompose';

// permettra de ne pas afficher de component avant redirection si l'authentification n'est pas correcte
import {AuthUserContext} from './Session-index';
import { withFirebase } from '../auth/firebase/context';
import * as ROUTES from '../auth/Routes';
import { compose } from 'recompose';

// le but de ce component sera de vérifier si une page est publique ou réservée à une certaine authentification
// dans ce cas une broad-grained authorization basée sur l'identification (oui ou non c'est un user connecté)
// il existe aussi fine-grained authorization basé sur le type d'user, example admin, etc ...
// https://www.robinwieruch.de/react-firebase-authorization-roles-permissions/

// prend un composant withAuthorization en entrée et le renvoie en sortie
// contenu dans une fonction du même nom

//va recevoir une fonction condition en paramètre
const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {

    // check les events firebase, si une modification de user a lieu
    componentDidMount() {


        // tout ce qui est écrit plus bas est géré dans l'api Firebase.js, 
	// donc en commentaire ici, et appelé avec onAuthUserListener
	// 2 fonctions sont passées en arguments et seront utilisée sous le nom de next et fallback dans Firebase.js
	// la première on doit dire ce qu'il se passe si pas connecté,dans ce cas-ci rien on a accès a l'url, et rediriger si pas connecté
	// la seconde pour rediriger si pas connecté
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.SIGN_IN);
          }
        },
        () => this.props.history.push(ROUTES.SIGN_IN),
      );


      /*this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {*/

	  // si user connecté
	  //if (authUser) {
		// écoute la réponse de firebase une seule fois
            /*this.props.firebase
              .user(authUser.uid)
              .once('value')
              .then(snapshot => {
                const dbUser = snapshot.val();*/

                // si le roles est vide ou innexistant pour cet user, on créé un objet vide pour celui-ci
                /*if (!dbUser.roles) {
                  dbUser.roles = {};
                }*/
		
                // merge auth and db user en fonction de l'email et de l'id
		// dans ce cas les ... ne sont pas une syntaxe "spread" mais un "rest"
		// cela permet de dire que l'on utilise tous les arguments, propriétés existant/e/s
		// cela donne un objet avec seulement les infos visibles de auth et db user, pas l'énorme aubjet authuser
                /*authUser = {
                  uid: authUser.uid,
                  email: authUser.email,
                  ...dbUser,
                };
		console.log("ceci est le merge :");console.log(authUser);*/

		// si l'authentification rate à cause de la condition non remplie, 
		// redirige vers la page de connexion
	  	// autrement le component ne fait rien et render le component demandé
	  	// le component à accès à l'objet history du withRouter de la librairie react-router afin de faire la redirection
                /*if (!condition(authUser)) {
                  this.props.history.push(ROUTES.SIGN_IN);
                }
              });
          }*/
		// autrement le authuser est null, redirige vers la page de connexion 
	  /*else {
            	this.props.history.push(ROUTES.SIGN_IN);
          }*/


        //},
      //);
    }

    componentWillUnmount() {
      this.listener();
    }

// render affichera le component passé comme home page, account page,
//...qui seront protégés par l'authorisation en réceptionant le contexte
    render() {
      return (
	     <AuthUserContext.Consumer>
          	{authUser =>
            		condition(authUser) ? <Component {...this.props} authUser={authUser} /> : null
          	}
             </AuthUserContext.Consumer>	
	);
    }
  }

  return compose(withRouter,withFirebase,)(WithAuthorization);
};

export default withAuthorization;
