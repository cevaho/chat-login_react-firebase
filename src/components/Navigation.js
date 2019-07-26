import React from 'react';
// import du component link depuis react-router-dom
import {Link,NavLink} from 'react-router-dom';
import SignOutButton from './auth/Signout';

// import des variables contenant les urls pour le routeur
import * as ROUTES from './auth/Routes';

// pour la gestion plus simple des sessions:
import { AuthUserContext } from './session/Session-index';

// affichera une navigation juste pour l'admin
import * as ROLES from './auth/Roles';

/* 
version simple sans gestion des sessions :
la navigation dépendera de l'authentification, 
passée en props au component navigation, 
après login ou signin, si true> navigationAuth false > l'opposé 

on utilise finalement le state d'authentification en props pour afficher certains lien pour les admins


const Navigation = ({ authUser }) => (
  <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
);

version plus complexe avec la gestion des session 
grace au authUserContext passé en provider dans app.js :
chaque component peut accéder à ce contexte sans devoir passer par d'autres components
*/

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

// les links sont de petits components chargés grâce à l'import de react-router-dom
const NavigationAuth = ({ authUser }) => (
<nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="nav navbar-nav mr-auto">
    <li className="nav-item">
      <NavLink to={ROUTES.HOME} className="nav-link" activeClassName="active">Le chalet</NavLink>
    </li>
    <li className="nav-item">
      <NavLink to={ROUTES.RESERVER} className="nav-link" activeClassName="active">Réserver</NavLink>
    </li>
    <li className="nav-item">
      <NavLink to={ROUTES.CHAT} className="nav-link" activeClassName="active">Commentaires</NavLink>
    </li>
</ul>
<ul className="nav navbar-nav ml-auto">
          {!!authUser.roles[ROLES.ADMIN] && (
		    <li className="nav-item">
		      	<NavLink to={ROUTES.RESERVATIONS} className="nav-link" activeClassName="active">Gestion des Réservations</NavLink>
		    </li>
    	   )}
          {!!authUser.roles[ROLES.ADMIN] && (
		    <li className="nav-item"><NavLink to={ROUTES.USERS} className="nav-link">Utilisateurs</NavLink></li>
    	   )}
	  {!!authUser.roles[ROLES.ADMIN] && (
		    <li className="nav-item"><NavLink to={ROUTES.SIGN_UPADMIN} className="nav-link">Créer un admin</NavLink></li>
    	   )}
    <li className="nav-item">
      <NavLink to={ROUTES.ACCOUNT} className="nav-link">Mon compte</NavLink>
    </li>
    <li className="nav-item">
      <SignOutButton />
    </li>
  </ul>
</div>
</nav>
);

const NavigationNonAuth = () => (
<nav className="navbar navbar-expand-lg navbar-light bg-light">
<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="nav navbar-nav">
    <li className="nav-item">
      <Link to={ROUTES.LANDING} className="nav-link">Le chalet</Link>
    </li>
    <li className="nav-item">
      <Link to={ROUTES.SIGN_IN} className="nav-link">Se connecter</Link>
    </li>
  </ul>
</div>
</nav>
);

/*
function Navigation() {
  return (
    <div className="navigation">
	<ul>
	      <li>
		<Link to={ROUTES.SIGN_UP}>Sign Up</Link>
	      </li>
	      <li>
		<Link to={ROUTES.SIGN_IN}>Sign In</Link>
	      </li>
	      <li>
		<Link to={ROUTES.LANDING}>Landing</Link>
	      </li>
	      <li>
		<Link to={ROUTES.HOME}>Home</Link>
	      </li>
	      <li>
        	<SignOutButton />
      	      </li>
    	</ul>
    </div>
  );
}
*/

export default Navigation;
