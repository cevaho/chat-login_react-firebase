import React, { Component } from 'react';

//sera utilisé pour construire un component en utilisant des fonctions de plusieurs autres components
import { compose } from 'recompose';

import { withFirebase } from './firebase/context';

// pour gérer l'affichage de la page en fonction de la connection
import { withAuthorization } from '../session/Session-index';

// affichera le component juste pour l'admin
import * as ROLES from './Roles';

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      //users: {},
      users:[],
    };
  }

  // après que le component soit monté
  // fetch les données de la DB firebase API (créé dans le dossier firebase) relative à tous les users, 
  // avec l'écouteur d'évenement .on 
  // (qui continue au contraire de .once)
  // les users sont des objets envoyés de la DB il faut les transformer en array pour être traité avec le mapping, 
  // plus facile pour les afficher
  // n'affichera que les users créés dans la DB après le développement de ce component, 
  // des users peuvent etre dans authentication mais pas dans la database de firebase
  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
	const usersObject = snapshot.val();
	console.log(usersObject);

	const usersList = Object.keys(usersObject).map(key => ({
        	...usersObject[key],
        	uid: key,
        }));

      this.setState({
        //users: snapshot.val(),
	users: usersList,
        loading: false,
      });
    });
  }

  // désactive l'évenement pour éviter les problèmes de mémoire
  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  // utilisation d'un component enfant pour afficher chaque user avec ses données
  // si loading=true affiche un message de chargement, le state loading change quand l'évenement .users().on() est terminé
  render() {
	const { users, loading } = this.state;

    return (
      <div className="row">
        <h1 className="col-12">&#x022C6; Admin &#x022C6;</h1>
	{loading && <div>Loading ...</div>}
	<UserList users={users} />
      </div>
    );
  }
}

// le component enfant est chargé dans le même component mais après le render du component parent
// map créé un array pour chaque user, c'est une sorte de boucle dans laquelle on va afficher les données dans du html
const UserList = ({ users }) => (
    <div className="col-12">
	<h3>Liste des utilisateurs enregistrés :</h3>
	<ul>
	    {users.map(user => (
	      <li key={user.uid}>
		{/*<span>
		  <strong>ID:</strong> {user.uid}
		</span>*/}
		<span>
		  <strong>Nom : </strong> {user.username}
		</span> <span>
		  <strong> e-mail : </strong> {user.email}
		</span>
	      </li>
	    ))}
	</ul>
   </div>
);

// condition identique à const condition = authUser => authUser != null;
// authUser.role.admin doit être une valaur booléenne "true" 
const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

// export du compenent en fonction de la condition d'authification

//export default withAuthorization(condition)(AdminPage);
// withfirebase est compris dans withauthorization
// export default withFirebase(AdminPage);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);
