import React from 'react';
import { withFirebase } from './firebase/context';

// fait appel à la méthode signout contenue dans le component firebase
const SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut} className="btn btn-info">
    Me déconnecter
  </button>
);

export default withFirebase(SignOutButton);
