import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './components/App'; //on importe le component App
import './css/index.css';
// import de la class firebase depuis son component pour l'utiliser dans le context
import Firebase from './components/auth/firebase/Firebase';
import FirebaseContext from './components/auth/firebase/context';
import 'bootstrap/dist/css/bootstrap.min.css';

// On utilise la méthode render() de ReactDOM pour décrire le DOM ,
// le premier paramètre correspond à ce que l'on veut rendre
// et le deuxième l'endroit où "accrocher" le DOM que l'on crée.
// ici : l'élément d'id root dans le fichier ./public/index.html

// afin de connecter react à firebase :
// on encapsule les component avec firebasecontext.provider pour ne charger firebase qu'une fois, et pas une fois par composant,
// ensuite chaque composant devra utiliser FirebaseContext.Consumer si il doit accéder à la DB
// context utilise l'API react context

// création de l'instance firebase grace à l'utilisation de la classe firebase
// passage de cette instance en props value pour le context.consumer

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
    	<App />
    </FirebaseContext.Provider>,
    document.getElementById('root')
);


//import * as serviceWorker from './serviceWorker';

//serviceWorker.unregister();
