import React, { Component } from 'react';
// withrouter permet la redirection apres inscription du user
import { withRouter } from 'react-router-dom';

import * as ROUTES from './Routes';
import * as ROLES from './Roles';

// import FirebaseContext from './firebase/context';
import { withFirebase } from './firebase/context';

import { AuthUserContext, withAuthorization } from '../session/Session-index';

import { compose } from 'recompose';

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

const SignUpAdminPage = () => (
	<AuthUserContext.Consumer>
	{authUser => (
	  <div className="row">
	    	<h1 className="col-12">&#x022C6; Créer un autre Admin &#x022C6;</h1>
		<p className="col-12">(fonction réservée aux administrateurs)</p>
	    	<SignUpForm  />
	  </div>
	)}
	</AuthUserContext.Consumer>
);

// les états dans un objet déstructuré permettront plus facilement de le remettre à zero apres le sign-up
const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin:false,
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
    const { email,passwordOne,username,isAdmin } = this.state;
    const roles = {};

    // si checkbox checkée pour admin(=true), on donnera un propriété admin avec la valeur de Admin du component Roles
    // ce role sera passé à la database lors de la création du user
    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

    // on en aura besoin pour les conditions dans les components :
    // (si utilisateur connecté applique ce qui est à doite de &&, 
    // le double ! converti une valeur en booléenne plutôt qu'un string)
    // const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

    // passe les valeurs de state à firebase via son component
    // qui contient les méthodes pour créer un user dans la DB (doCreateUser..)
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database giving him Id, name, email, roles (for admin, etc..)
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
	    roles,
          });
      })
      .then(authUser => {
	// modification de la valeur deisplayName qui n'enregistre pas le username par défaut dans l'objet user
	// à cause d'un bug firebase
	let user = this.props.firebase.auth.currentUser;
		if (user != null) {
			console.log("gotochange profile"+username);
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

  // changement d'état grâce à la checkbox pour un compte admin ou pas
  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };


  render() {

    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    // pour la validation des champs si les conditions sont remplies on peut activer le bouton d'envoi du formulaire
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';


    return (
      <div className="col-12">
      <form onSubmit={this.onSubmit}>
	<div>
		<input
		  name="username" 
		  value={username}
		  onChange={this.onChange}
		  type="text"
		  placeholder="Nom complet"
		/>
	</div>
	<div>
		<input
		  name="email"
		  value={email}
		  onChange={this.onChange}
		  type="text"
		  placeholder="Adresse e-mail"
		/>
	</div>
	<div>
		<input
		  name="passwordOne"
		  value={passwordOne}
		  onChange={this.onChange}
		  type="password"
		  placeholder="Mot de passe"
		/>
	</div>
	<div>
		<input
		  name="passwordTwo"
		  value={passwordTwo}
		  onChange={this.onChange}
		  type="password"
		  placeholder="Confirmer le mot de passe"
		/>
	<div>
	</div>
		<label htmlFor="isAdmin"> <input name="isAdmin" type="checkbox" checked={isAdmin} onChange={this.onChangeCheckbox} /> Admin
		</label>
	</div>	
		
        <button type="submit" disabled={isInvalid} className="btn btn-info">Créer</button>

        {error && <p>{error.message}</p>}
      </form></div>
    );
  }
}

/*const SignUpLink = () => (
  <p>
    Pas encore de compte? <Link to={ROUTES.SIGN_UP}>Créer un compte</Link>
  </p>
);*/



// condition identique à const condition = authUser => authUser != null;
// authUser.role.admin doit être une valaur booléenne "true" 
const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

// const SignUpForm = withFirebase(SignUpFormBase);
// withRouter() donne accès à toutes les propriété du router pour un component 
// dont l'objet history passé en state plus haut dans le code, il permet la redirection en y placant une autre url
// const SignUpForm = withRouter(withFirebase(SignUpFormBase));
// le package "compose" permetrait de faciliter l'utilisation de plusieures propriétés/méthods de manière plus claire comme ceci
const SignUpForm = compose(
  withAuthorization(condition),
  withRouter,
  withFirebase,
)(SignUpFormBase);


export default SignUpAdminPage;

export { SignUpForm };
