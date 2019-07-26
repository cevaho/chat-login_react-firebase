import React, {Component} from 'react';
import { Modal } from 'react-bootstrap';
import { withFirebase } from './../auth/firebase/context';

class ModalPopUpOne extends Component {

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
	editToDB = (idAccepted) => {
			console.log("idMessage accepted = "+this.props.dateAccepted+" statu = booked accepté ");
				this.props.firebase.reservation(idAccepted).update({statut:"booked"});
				/*this.props.firebase.reservation(idAccepted).update({
										    username:this.props.username,
										    dateEnvoi:this.props.dateEnvoi,
										    range:{
										"from":new Date(this.props.dateFrom).getTime(),
										"to":new Date(this.props.dateTo).getTime()},
										    statut:"booked"
										    });*/
				this.handleClosei();
			};

	// fonction de changement de statut en booked pour accepter la réservation
	annuleToDB = (idAccepted) => {
			console.log("idMessage = "+idAccepted+" statut = refuse, ");
				this.props.firebase.reservation(idAccepted).update({statut:"refuse"});
				this.handleClosei();
			};
	

  render() {

    return (
		<div>
			
			<span className="spaner1"><button className="btn btn-success"
						onClick={() => {let ida='Accepter'+this.props.dateAccepted;this.handleShow(ida)}}>Accepter</button>
					</span>
			<span className="spaner2 spacer"><button className="btn btn-danger"
						onClick={() => {let ido='Supprimer'+this.props.dateAccepted;this.handleShow(ido)}}>Annuler</button>
					</span>


		       <Modal show={this.state.showi === 'Accepter'+this.props.dateAccepted} onHide={this.handleClosei}>
		        	<Modal.Header closeButton closeLabel="close window">
					<Modal.Title>Accepter une réservation</Modal.Title>
				</Modal.Header>
		        	<Modal.Body>
					<p>Pour prévenir l'utilisateur qu'il pourra louer le chalet à cette période cliquez sur</p>

            		    		<button className="btn btn-success" id="envoi_newmessage" 
						value="accepter" onClick={()=>{this.editToDB(this.props.dateAccepted)}}>Accepter</button>
        			
				</Modal.Body>
				<Modal.Footer><button variant="primary" onClick={this.handleClosei}>fermer</button>
				</Modal.Footer>
		       </Modal>


			<Modal show={this.state.showi === 'Supprimer'+this.props.dateAccepted} onHide={this.handleClosei}>
		        	<Modal.Header closeButton closeLabel="close window">
					<Modal.Title>Annuler la réservation</Modal.Title>
				</Modal.Header>
		        	<Modal.Body><p>L'utilisateur ne pourra pas réserver le chalet pendant cette période</p>
					<button  className="btn btn-danger"
								onClick={this.annuleToDB.bind(this,this.props.dateAccepted)}>
						      Annuler</button>
				 </Modal.Body>
				<Modal.Footer>
						    <button variant="primary" onClick={this.handleClosei}>fermer</button>
						  </Modal.Footer>
		       	</Modal>
			
		</div>
    );
  }
}



// export du component
export default withFirebase(ModalPopUpOne);
