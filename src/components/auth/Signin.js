import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as ROUTES from './Routes';
import { withFirebase } from './firebase/context';
import { SignUpLink } from './Signup';
import { PasswordForgetLink } from './PasswordForget';

const SignInPage = () => (
  <div className="row">
    <h1 className="col-12">&#x022C6; Connexion &#x022C6;</h1>
    <SignInForm />
    <div className="col-12">
    	<PasswordForgetLink />
    	<SignUpLink />
    </div>
  </div>
);

// les états dans un objet déstructuré permettront plus facilement de le remettre à zero après le sign-up
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div className="col-12">
      <form onSubmit={this.onSubmit}>
	<div>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Adresse e-mail"
        />
	</div><div>
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="mot de passe"
        />
	</div>
	<div>
        <button disabled={isInvalid} type="submit" className="btn btn-success">
          Me connecter
        </button>
	</div>
        {error && <p>{error.message}</p>}
      </form>
      </div>
    );
  }
}

// const SignUpForm = withFirebase(SignUpFormBase);
// withRouter() donne accès à toutes les propriété du router pour un component 
// dont l'objet history passé en state plus haut dans le code, il permet la redirection en y placant une autre url
const SignInForm = withRouter(withFirebase(SignInFormBase));
/*
const SignInForm = compose(withRouter,withFirebase,)(SignInFormBase);
*/

// le package "compose" permetrait de faciliter l'utilisation de plusieures propriétés/méthods de manière plus claire comme ceci
// const SignUpForm = compose(withRouter,withFirebase)(SignUpFormBase);


export default SignInPage;

export { SignInForm };
