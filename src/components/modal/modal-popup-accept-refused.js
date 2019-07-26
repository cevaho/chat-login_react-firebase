import React, {Component} from 'react';
import { Modal } from 'react-bootstrap';
import { withFirebase } from './../auth/firebase/context';

class ModalPopUpAD extends Component {

	constructor(props) {
		super(props);
		
		//console.log("modal props "+JSON.stringify(this.props));
		//console.log("accepetd "+this.props.dateAccepted);
		//console.log("denied "+this.props.dateDenied);

		this.handleShow = this.handleShow.bind(this);
    	this.handleClose = this.handleClose.bind(this);

	    this.state = {
	      //text:"", 
	      //messages:[],
	      show: null,
	      //newid:"",
	      //newtext:"",
	      loading: false,
		}
	}
  

  	// fonctions de fermeture et ouverture de pop-up par changement d'état bootstrap
	handleClose() {
	    this.setState({ show: null });
	}
	handleShow(id) {
		//console.log(this.props.dateAccepted);
	    this.setState({ show: this.props.dateAccepted });
	}


	// fonction d'edition d'un message
	editToDB = (e,idAccepted,idDenied) => {
			//console.log("idMessage = "+this.props.dateAccepted+" statu = accepté, "+idDenied+" refusé");
				this.props.firebase.reservation(idAccepted).update({statut:"booked"});
				this.props.firebase.reservation(idDenied).update({statut:"refuse"});
				this.handleClose();
			};

  render() {

    return (
		<div>
			
			<span className="spaner1"><button className="btn btn-success"
						onClick={() => { this.handleShow(this.props.dateAccepted)}}>Accepter cette réservation</button>
					</span>


		       <Modal show={this.state.show === this.props.dateAccepted} onHide={this.handleClose}>
		        	<Modal.Header closeButton closeLabel="close window">
					<Modal.Title>Accepter une réservation</Modal.Title>
				</Modal.Header>
		        	<Modal.Body>
					<p>Accepter la réservation annulera l'autre demande de réservation ayant des dates en commun</p>

            		    		<button className="btn btn-success" id="envoi_newmessage" 
						value="modifier" onClick={(event)=>{this.editToDB(event,this.props.dateAccepted,this.props.dateDenied)}}>Accepter</button>
        			
				</Modal.Body>
				<Modal.Footer><button variant="primary" onClick={this.handleClose}>fermer</button>
				</Modal.Footer>
		       </Modal>
			
		</div>
    );
  }
}



// export du component
export default withFirebase(ModalPopUpAD);
