/*
 création de composants de session 
 pour éviter que l'utilisateur connecté ne doivent passer par 
 plein de composants afin de recevoir les infos d'authification en props
*/

import React from 'react';

const AuthUserContext = React.createContext(null);

export default AuthUserContext;
