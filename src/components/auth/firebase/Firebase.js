// import React from 'react';

// import app from './FirebaseCaps';
// import possible grace au package react-with-firebase-auth
import app from 'firebase/app';
// import pour utiliser l'API d'authentification de firebase dans ce component et donc les méthodes associées
import 'firebase/auth';

//pour la gestion des données, avoir accès à des données de user, en créer directement dans la DB pour les admins
// au préalable activer la DB dans firebase> database > realtime database > regle, suivre tuto
import 'firebase/database';


// import des variables/clés de connexion
import config from './config';


/*
prépéaration des données transférée depuis .env si on avait chargé le projet avec REAC_APP_create-react-app
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};
*/

// création de la objet firebase utilisant 
// - l'objet app du package react-with-firebase-auth
// - l API auth du même package
// - les variables de connexion du component config
// - les données utilisateurs contenu dans firebase via la DB
class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }


	// *** Merge Auth and DB User API *** pourrait être placé dans withAuthentification et withauthorization 
	// mais le placer ici évitera de la faire deux fois//
	// fonction qui va checheker l'état d'authentification du user avec les fonctions next et fallback en argument
	// la première pour fusionner les db user, la seconde dans le cas l'user n'est pas identifié
	// ceux-ci utiliseront les états d'authentification et les redirections selon l'authorisation
	  onAuthUserListener = (next, fallback) =>
	    this.auth.onAuthStateChanged(authUser => {
	      if (authUser) {
		this.user(authUser.uid)
		  .once('value')
		  .then(snapshot => {
		    const dbUser = snapshot.val();

		    // si le roles est vide ou innexistant pour cet user, on créé un objet vide pour celui-ci
		    if (!dbUser.roles) {
		      dbUser.roles = {};
		    }

		    // merge auth and db user en fonction de l'email et de l'id
		    // dans ce cas les ... ne sont pas une syntaxe "spread" mais un "rest"
		    // cela permet de dire que l'on utilise tous les arguments, propriétés existant/e/s
		    // cela donne un objet avec seulement les infos visibles de auth et db user, pas l'énorme aubjet authuser
		    authUser = {
		      uid: authUser.uid,
		      email: authUser.email,
		      ...dbUser,
		    };

		    // renvoie un objet avec une propriété done: true or false et une propriété contenant le authuser
		    // en fait non ce n'est pas la fonction next de js mais une nouvelle passée en argument 
		    // qui change l'etat authuser et y ajoute les données de roles, ou qui change la redirection 
		    // (dépendant de la fonction next qui change selon le component qui l'appele)
		    next(authUser);
		  });
	      } else {
		// change l'état de authUser=null
		fallback();
	      }
	    });



  // *** User API ***

  //  fonction d'enregistrement de nouveau user liée à l'api auth de firebase 
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  // fonction de vérification d'email/password pour la connexion
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  // fonction de déconnection
  doSignOut = () => this.auth.signOut();

  // fonction d'oubli de password
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  // fonction de modification de password
  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // firebase DB User API
  // le nom de la fonction sera utilisée pour écouter les évènements firebase.user() ou firebase.messages()
  // pour réceptionner les données d'un user 
  // la méthode ref() prend la location du user dans la DB
  user = uid => this.db.ref(`users/${uid}`);

  // pour tous les users
  users = () => this.db.ref('users');

  // *** Message API ***
  message = uid => this.db.ref(`messages/${uid}`);
  messages = () => this.db.ref('messages');

}

export default Firebase;
