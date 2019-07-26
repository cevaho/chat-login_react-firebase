import React, { Component } from 'react';

//sera utilisé pour construire un component en utilisant des fonctions de plusieurs autres components
import { compose } from 'recompose';

import { withFirebase } from './firebase/context';

// pour gérer l'affichage de la page en fonction de la connection
import { withAuthorization } from '../session/Session-index';

// affichera le component juste pour l'admin
import * as ROLES from './Roles';

import ModalPopUpAdmin from './../modal/modal-popup-admin';

//import ReservationsList from './../reservationsList';


class UsersPage extends Component {
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
  // les users sont des objets dans un objet envoyés de la DB il faut les transformer en array pour être traité avec le mapping, 
  // suppression de la clé de l'objet et ajout de propriété contenant la clé sans l'array
  // plus facile pour les afficher
  // n'affichera que les users créés dans la DB après le développement de ce component, 
  // des users peuvent etre dans authentication mais pas dans la database de firebase
  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
	const usersObject = snapshot.val();
	//console.log(usersObject);

	const usersList = Object.keys(usersObject).map(key => ({
        	...usersObject[key],
        	uid: key,
        }));

	//console.log(usersList);
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
      <div className="adminer row">
        <h1 className="col-12">&#x022C6; Liste des utilisateurs &#x022C6;</h1>
	{loading && <div>Loading ...</div>}
	<UserList users={users} />
	{/*<ReservationsList />*/}
      </div>
    );
  }
}

// le component enfant est chargé dans le même component mais après le render du component parent
// map créé un array pour chaque user, c'est une sorte de boucle dans laquelle on va afficher les données dans du html
const UserList = ({ users }) => (
    <div className="col-12 usering">
	{/*<h3>Liste des utilisateurs enregistrés :</h3>*/}
	<ul>
	    {users.map(user => (
	      <li key={user.uid} className="row">
		<div className="col-12 col-md-4"><span>Nom : <strong> {user.username}</strong></span></div>
		<div className="col-12 col-md-3"><span>E-mail : <strong> {user.email}</strong></span></div>
		<div className="col-12 col-md-5">
			{user.roles.ADMIN && <span className="statuter">Rôle : <strong>ADMIN </strong></span>}
			{user.roles.normal && <span className="statuter">Rôle : <strong>normal </strong></span>}
			<ModalPopUpAdmin idUserToChange={user.uid} email={user.email} name={user.username}></ModalPopUpAdmin>
		</div>
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
)(UsersPage);
