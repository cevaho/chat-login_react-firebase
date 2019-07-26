import React, {Component} from 'react';
import { Modal } from 'react-bootstrap';
import { withFirebase } from './../auth/firebase/context';

class ModalPopUpAcc extends Component {

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
	editToDB = (e,idAccepted) => {
			//console.log("idMessage = "+this.props.dateAccepted+" statu = accepté, "+idDenied+" refusé");
				this.props.firebase.reservation(idAccepted).update({statut:"booked"});
				this.handleClosei();
			};
	

  render() {

    return (
		<div>
			
			<span className="spaner1"><button className="btn btn-success"
						onClick={() => {let ida='Accepter'+this.props.dateAccepted;this.handleShow(ida)}}>Accepter</button>


		       <Modal show={this.state.showi === 'Accepter'+this.props.dateAccepted} onHide={this.handleClosei}>
		        	<Modal.Header closeButton closeLabel="close window">
					<Modal.Title>Accepter une réservation</Modal.Title>
				</Modal.Header>
		        	<Modal.Body>
					<p>Accepter la réservation annulera l'autre demande de réservation ayant des dates en commun</p>

            		    		<button className="btn btn-success" id="envoi_newmessage" 
						value="accepter" onClick={()=>{this.editToDB(this.props.dateAccepted)}}>Accepter</button>
        			
				</Modal.Body>
				<Modal.Footer><button variant="primary" onClick={this.handleClosei}>fermer</button>
				</Modal.Footer>
		       </Modal>
			
		</div>
    );
  }
}



// export du component
export default withFirebase(ModalPopUpAcc);
