import React, {Component} from 'react';

import { withAuthorization } from './../session/Session-index';

import DatePicker2 from './DatePicker/DatePicker2';
//import OrdersIndex from './test';
//import JustTable from './justTable';


//function HomePage() {


class Reserver extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      show: null
    };
  }

  render() {
    return (
      <div className="HomePage row">
	<h1 className="col-12">&#x022C6; Réserver le chalet &#x022C6;</h1>
		<DatePicker2/>{/*<OrdersIndex/><JustTable/>*/}
	{/*<div className="col-4">

		<h2>Demande de réservation du chalet :</h2>
		<p>La demande sera envoyée à l'administrateur avant confirmation</p>
		{/*<OrdersIndex/>	
	</div>*/}
      </div>
    );
  }
}
 
// condition identique à const condition = authUser => authUser != null;
// authUser doit être différent de null
const condition = authUser => !!authUser;

// export du compenent en fonction de la condition d'authification
export default withAuthorization(condition)(Reserver);
