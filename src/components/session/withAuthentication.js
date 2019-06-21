/* contient la logique de gestion de l'authentification pour ne pas la retrouver dans le component app.js*/
import React from 'react';

import AuthUserContext from './Session-context';
import { withFirebase } from '../auth/firebase/context';

// une fonction prendra un component en argument pour le générer avec les info du user en props
const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

  // Lorsque le component a été monté on ajoute le state dépendant de l'authentification en props 
  // en écoutant l'évenement d'état d'authentification qui change et reçoit une fonction en paramètre
  // cette fonction est appelée à chaque fois que le state change
  // la déconnexion signout change l'objet authUser qui devient null et le state aussi
  // pour des questions de performance l'écouteur d'évenement sera supprimé si le component n'est pas monté/chargé
  componentDidMount() {

	// tout ce qui est écrit plus bas est géré dans l'api Firebase.js, 
	// donc en commentaire ici, et appelé avec onAuthUserListener
	// 2 fonctions sont passées en arguments et seront utilisée sous le nom de next et fallback dans Firebase.js
	// la première pour fusionner les db user, la seconde dans le cas l'user n'est pas identifié
	   this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          this.setState({ authUser });
        },
        () => {
          this.setState({ authUser: null });
        }
	   );

    //this.props.firebase.auth.onAuthStateChanged(authUser => {
    //this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      /* authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null }); */


	// si user connecté
	// ecouté l'event une seule fois pour recevoir les données relative au user via son id
	/*if (authUser) {
            this.props.firebase
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
                };*/
		
		// changer l'état de authUser qui contiendra les infos de role Admin ou pas, 
		// que tous les components pourront utiliser
                /*this.setState({ authUser });
              });
          } 
	  // autrement l'etat est null
	  else {
            this.setState({ authUser: null });
          }*/

    //},
   //);
  }

    // désactive l'event lorsque le component changera
    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
