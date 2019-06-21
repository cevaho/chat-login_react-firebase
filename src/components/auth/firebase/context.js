import React from 'react';

// l'utilisation du contexte va permettre de ne pas charger firebase à chaque chargement de component
// juste une fois en liant le component fournissant firebase (.provider) au component receptionnant firebase (.consumer)
// sans cela on devra lier firebase à react via une copie/instance de la class firebase dans chaque component

// la fonction createContext crée deux component, le .provider et le .consumer
// le provider ne sera indiqué qu'une fois en top de l'arborescence des components dans index.js
// le consumer va rechercher l'instance firebase si le component en a besoin, il va communiquer avec firebase depuis react
const FirebaseContext = React.createContext(null);


export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

// donnera une instance firebase pour toute l'application
export default FirebaseContext;
