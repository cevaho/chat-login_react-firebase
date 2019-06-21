import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from './firebase/context';
import * as ROUTES from './Routes';

const PasswordForgetPage = () => (
  <div>
    <h1>Mot de passe oublié</h1>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

/*
- appel à l'api firebase pour modifier le mot de passe dans la DB 
  -> Surtout la fontion qui envoie un email pour changer le mdp
	un lien dans l'email amène à une page firebase qui permet de changer le mot de passe 
	mais ne redirige pas vers le site en lui-même
- changer sa valeur nulle de l'email en state en le remplacant par le nouveau inscrit dans le champs
- enregistre l'erreur dans les inscriptions des inputs du form
- empêche le rechargement de la page après soumission du form
*/

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  // lors du changement de valeur dans l'input, assigner cette valeur au state
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
     <div className="col-12">
      <form onSubmit={this.onSubmit}>
	<div>
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Adresse e-mail"
        /></div><div>
        <button disabled={isInvalid} type="submit" className="btn btn-info">
          Envoyer par e-mail email
        </button></div>

        {error && <p>{error.message}</p>}
      </form></div>
    );
  }
}

// l'appel de cette constante affichera le lien d'oubli de password dans le component qui l'appelera grâce à son export
const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Mot de passe oublié ?</Link>
  </p>
);

// exporte le container qui engloble le formulaire
export default PasswordForgetPage;

// gère le contexte et l'utilisation unique de firebase pour ce formulaire
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

// exporte le form et son lien pour d'autres components
export { PasswordForgetForm, PasswordForgetLink };
