import React, {Component} from 'react';

import { withAuthorization } from './session/Session-index';

//import { Modal, Col, Row, Button } from 'react-bootstrap';
//import { Grid } from 'react-bootstrap/Grid';
//import { Col } from 'react-bootstrap/Col';
//import { Modal } from 'react-bootstrap';
//import { Row } from 'react-bootstrap/Row';
//import { Button } from 'react-bootstrap/Button';
//import Bootstrap from "react-bootstrap";


//function HomePage() {


class HomePage extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: null
    };
  }

  handleClose() {
    this.setState({show: null});
  }

  handleShow(id) {
    this.setState({show: id});
  }

  render() {
    return (
      <div className="HomePage row">
	<h1 className="col-12">&#x022C6; Ceci est la page d'accueil &#x022C6;</h1>
	<p className="col-12">La page d'accueil est accessible par tous les utilisateurs connectés.<br /> son contenu peut différer de la landing page.</p>
      </div>
    );
  }
}
 
// condition identique à const condition = authUser => authUser != null;
// authUser doit être différent de null
const condition = authUser => !!authUser;

// export du compenent en fonction de la condition d'authification
export default withAuthorization(condition)(HomePage);
