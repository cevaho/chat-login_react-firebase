import React, { Component } from 'react';

import { withFirebase } from './firebase/context';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <div className="col-12">
      <form onSubmit={this.onSubmit}>
	<div>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Nouveau mot de passe"
        /></div>
	<div>
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirmation du mot de passe"
        /></div>
	<div>
        <button disabled={isInvalid} type="submit" className="btn btn-info">
          Changer
        </button>
	</div>
        {error && <p>{error.message}</p>}
      </form></div>
    );
  }
}

export default withFirebase(PasswordChangeForm);
