// permet de centraliser différents components dans un seul appel pour un autre component

import AuthUserContext from './Session-context';

// pour pouvoir utiliser la gestion indépendante des authentifications en dehors du app.js
import withAuthentication from './withAuthentication';

// pour la gestion des autorisation d'accès au page en fonction de la connexion
import withAuthorization from './withAuthorization';

export { AuthUserContext, withAuthentication, withAuthorization };
