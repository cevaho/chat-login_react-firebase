import React, {Component} from 'react';

import { withAuthorization } from './session/Session-index';


class HomePage extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      show: null
    };
  }

  render() {
    return (
      <div className="HomePage row">
	<h1 className="col-12">&#x022C6; Le chalet du Pitou &#x022C6;</h1>
	<p>Quelques images du chalet :</p>
      </div>
    );
  }
}
 
// condition identique à const condition = authUser => authUser != null;
// authUser doit être différent de null
const condition = authUser => !!authUser;

// export du compenent en fonction de la condition d'authification
export default withAuthorization(condition)(HomePage);
