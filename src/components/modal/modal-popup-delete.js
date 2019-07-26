import React, {Component} from 'react';
import { Modal } from 'react-bootstrap';
import { withFirebase } from './../auth/firebase/context';

class ModalPopUpDel extends Component {

	constructor(props) {
		super(props);
		
		//console.log("modal props "+JSON.stringify(this.props));
		//console.log("accepetd "+this.props.dateAccepted);
		//console.log("denied "+this.props.dateDenied);

		this.handleShow = this.handleShow.bind(this);
    		this.handleClosei = this.handleClosei.bind(this);

	    	this.state = {
	      		showi: null,
		}
	}
  

  	// fonctions de fermeture et ouverture de pop-up par changement d'état bootstrap
	handleClosei() {
	    this.setState({ showi: null }, 
					() => {
				console.log("state showi = "+this.state.showi);
					}
			);
	}
	handleShow(id) {
		console.log(id);
	    this.setState({ showi: id }, 
					() => {
				console.log("state showi = "+this.state.showi);
					});
	}

	// fonction de changement de statut en booked pour accepter la réservation
	annuleToDB = (idAccepted) => {
			console.log("idMessage = "+idAccepted+" statut = refuse, ");
				this.props.firebase.reservation(idAccepted).remove();
				this.handleClosei();
			};
	

  render() {

    return (
		<>
			<span className="spaner2 spacer"><button className="btn btn-danger"
						onClick={() => {let ido='Supprimer'+this.props.dateAccepted;this.handleShow(ido)}}>X</button>
					</span>



			<Modal show={this.state.showi === 'Supprimer'+this.props.dateAccepted} onHide={this.handleClosei}>
		        	<Modal.Header closeButton closeLabel="close window">
					<Modal.Title>Supprimer de la liste</Modal.Title>
				</Modal.Header>
		        	<Modal.Body><p>Cette demande de réservation sera définitivement supprimée</p>
					<button className="btn btn-danger"
								onClick={this.annuleToDB.bind(this,this.props.dateAccepted)}>
						      Supprimer</button>
				</Modal.Body>
				<Modal.Footer>
						    <button variant="primary" onClick={this.handleClosei}>fermer</button>
						  </Modal.Footer>
		       	</Modal>
			
		</>
    );
  }
}



// export du component
export default withFirebase(ModalPopUpDel);
