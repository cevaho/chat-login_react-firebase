import React, { Component } from 'react';
// withrouter permet la redirection apres inscription du user
import { Link, withRouter } from 'react-router-dom';

import * as ROUTES from './Routes';

// import FirebaseContext from './firebase/context';
import { withFirebase } from './firebase/context';
//import { AuthUserContext } from '../session/Session-index';
//import { withAuthorization } from '../session/Session-index';

/* 
	le firebasecontext va etre géré autrement pour ne pas le placer la dans le code modifiable,
	et l'alléger à cet endroit
	grace à withFirebase et les modifications de firebase context
	const SignUpPage = () => (
	  <div>
	    <h1>SignUp</h1>
		<FirebaseContext.Consumer>
	      		{firebase => 
				<SignUpForm firebase={firebase} />
			}
		</FirebaseContext.Consumer>
	  </div>
	);
*/

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm  />
  </div>
);

// les états dans un objet déstructuré permettront plus facilement de le remettre à zero apres le sign-up
const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

//class SignUpForm extends Component {
class SignUpFormBase extends Component {

  constructor(props) {
    super(props);

	//le state appel l'objet déstructuré définit plus haut
    this.state = { ...INITIAL_STATE };
  }
      
   

  onSubmit = event => {

    // prend les valeurs de state
    const { email,passwordOne,username } = this.state;
    

    // on en aura besoin pour les conditions dans les components :
    // (si utilisateur connecté applique ce qui est à doite de &&, 
    // le double ! converti une valeur en booléenne plutôt qu'un string)
    // const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

    // passe les valeurs de state à firebase via son component
    // qui contient les méthodes pour créer un user dans la DB (doCreateUser..)
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database giving him Id, name, email 
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
          });
      })
      .then(authUser => {
	// modification de la valeur deisplayName qui n'enregistre pas le username par défaut dans l'objet user
	// à cause d'un bug firebase
	let user = this.props.firebase.auth.currentUser;
		if (user != null) {
			//console.log("gotochange profile"+username);
	  		user.updateProfile({displayName: username})
			.then(function() {
				  var displayName = user.displayName;
				  console.log("Profile updated successfully"+displayName);
				})
		}

        this.setState({ ...INITIAL_STATE });
	// ajoute un état pour la redirection en cas d'inscription, force la direction vers la home page
	this.props.history.push(ROUTES.HOME);
	//console.log("l'etat username : "+username);

      })
	//récupère l'erreur si il y en a une, pour l'afficher en dessous du formulaire
      .catch(error => {
        this.setState({ error });
      });

    // empêche le rechargement de la page après le clic sur le bouton
    event.preventDefault();

  }

  // changement d'état lors du changement de valeur dans l'input
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {

    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    // pour la validation des champs si les conditions sont remplies on peut activer le bouton d'envoi du formulaire
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';


    return (
      <form onSubmit={this.onSubmit}>
		<input
		  name="username" 
		  value={username}
		  onChange={this.onChange}
		  type="text"
		  placeholder="Nom d'utilisateur"
		/>

		<input
		  name="email"
		  value={email}
		  onChange={this.onChange}
		  type="text"
		  placeholder="Adresse e-mail"
		/>

		<input
		  name="passwordOne"
		  value={passwordOne}
		  onChange={this.onChange}
		  type="password"
		  placeholder="Mot de passe"
		/>

		<input
		  name="passwordTwo"
		  value={passwordTwo}
		  onChange={this.onChange}
		  type="password"
		  placeholder="Confirmer le mot de passe"
		/>
		
        <button type="submit" className="btn btn-success" disabled={isInvalid}>Je crée mon compte</button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Vous n'avez pas encore de compte ? <Link to={ROUTES.SIGN_UP}>Créer mon compte</Link>
  </p>
);

	// const SignUpForm = withFirebase(SignUpFormBase);
// withRouter() donne accès à toutes les propriété du router pour un component 
// dont l'objet history passé en state plus haut dans le code, il permet la redirection en y placant une autre url
const SignUpForm = withRouter(withFirebase(SignUpFormBase));

// le package "compose" permetrait de faciliter l'utilisation de plusieures propriétés/méthods de manière plus claire comme ceci
// const SignUpForm = compose(withRouter,withFirebase)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
