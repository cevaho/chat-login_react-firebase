import React, {Component} from 'react';
import { Modal } from 'react-bootstrap';
import { withFirebase } from './../auth/firebase/context';

class ModalPopUpStatChange extends Component {

	constructor(props) {
		super(props);
		
		//console.log("modal props "+JSON.stringify(this.props));
		//console.log("accepetd "+this.props.dateAccepted);
		//console.log("denied "+this.props.dateDenied);

		this.handleShow = this.handleShow.bind(this);
    		this.handleClosei = this.handleClosei.bind(this);

	    	this.state = {
	      		showi: null,
			newStatut:"",
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
	editToDB = (event,idAccepted) => {
			console.log("idDate = "+this.props.dateAccepted+" statu = "+this.state.newStatut);

				if(this.state.newStatut !== ""){

					/*console.log("username:"+this.props.username);
					console.log("dateEnvoi:"+new Date().getTime());
					console.log("range:{'from':"+this.props.dateFrom);
					console.log("to:"+this.props.dateTo);
					console.log("statut:"+this.state.newStatut);*/

					this.props.firebase.reservation(idAccepted).update({
										username:this.props.username,
										dateEnvoi:new Date().getTime(),
										range:{
										"from":new Date(this.props.dateFrom).getTime(),
										"to":new Date(this.props.dateTo).getTime()},
										statut:this.state.newStatut
										});

					}
				event.preventDefault();
				this.handleClosei();
			};
	

  render() {

    return (
		<>
			
			<span className="spaner1"><button className="btn btn-info"
						onClick={() => {let ida='Modifier'+this.props.dateAccepted;this.handleShow(ida)}}>Modifier</button>
					</span>



		       <Modal show={this.state.showi === 'Modifier'+this.props.dateAccepted} onHide={this.handleClosei}>
		        	<Modal.Header closeButton closeLabel="close window">
					<Modal.Title>Modifier le statut d'une réservation</Modal.Title>
				</Modal.Header>
		        	<Modal.Body>
					<p>Veuillez sélectionner un nouveau statut ou garder l'ancien</p>
            		    		<form action="/" 
						onSubmit={(event)=>{this.editToDB(event,this.props.dateAccepted)}} id="formulaire_new">

						<select name="newstat" id="newstat" 
						onChange={event=>this.setState({newStatut:event.target.value})}>
							<option value="initial">Statut initial :</option>
							<option value="booked">Réservé</option>
							<option value="demande">En attente</option>
							<option value="refuse">Annulé</option>
						</select>

            		    			<button className="btn btn-success" type="submit" id="envoi_newmessage" 
						value="modifier">Modifier le statut</button>
        				</form>
        			
				</Modal.Body>
				<Modal.Footer><button variant="primary" onClick={this.handleClosei}>fermer</button>
				</Modal.Footer>
		       </Modal>
			
		</>
    );
  }
}



// export du component
export default withFirebase(ModalPopUpStatChange);
