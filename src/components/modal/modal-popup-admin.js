import React, {Component} from 'react';
import { Modal } from 'react-bootstrap';
import { withFirebase } from './../auth/firebase/context';

class ModalPopUpAdmin extends Component {

	constructor(props) {
		super(props);
		
		//console.log("modal props "+JSON.stringify(this.props));
		//console.log("accepetd "+this.props.dateAccepted);
		//console.log("denied "+this.props.dateDenied);

		this.handleShow = this.handleShow.bind(this);
    		this.handleClosei = this.handleClosei.bind(this);

	    	this.state = {
	      		showi: null,
			newStatut:""
		}
	}
  

  	// fonctions de fermeture et ouverture de pop-up par changement d'état bootstrap
	handleClosei() {
	    this.setState({ showi: null }, 
					() => {
				//console.log("state showi = "+this.state.showi);
					}
			);
	}
	handleShow(id) {
		//console.log(id);
	    this.setState({ showi: id }, 
					() => {
				//console.log("state showi = "+this.state.showi);
					});
	}


	// fonction de changement de statut en booked pour accepter la réservation
	editToDB = (e,idUserToChange) => {
			//console.log("idUser = "+idUserToChange);
			//console.log("statut "+this.state.newStatut);
				if(this.state.newStatut === "ADMIN"){
					this.props.firebase
          					.user(idUserToChange)
          					.set({username:this.props.name,email:this.props.email,
	    						roles:{"ADMIN" : "ADMIN"}
          						});
					//e.preventDefault();
					}
				else{
					this.props.firebase
          					.user(idUserToChange)
          					.set({username:this.props.name,email:this.props.email,
	    						roles:{"normal" : "normal"}
          						});
					}

				e.preventDefault();
				this.handleClosei();
			};
	

  render() {

    return (
		<>
			
			<span className="spaner1 spacer"><button className="btn btn-info"
						onClick={() => {let ida='Changer'+this.props.idUserToChange;this.handleShow(ida)}}>Changer le rôle</button>
					</span>



		       <Modal show={this.state.showi === 'Changer'+this.props.idUserToChange} onHide={this.handleClosei}>
		        	<Modal.Header closeButton closeLabel="close window">
					<Modal.Title>Donner le rôle de l'utilisateur</Modal.Title>
				</Modal.Header>
		        	<Modal.Body>
					<p>Voullez-vous vraiment changer le rôle, afin de modifier les accès et la responsabilité de cet utilisateur ?</p>

					<form action="/" 
						onSubmit={(event)=>{this.editToDB(event,this.props.idUserToChange)}} id="formulaire_new">

						<select name="newstat" id="newstat" 
						onChange={event=>this.setState({newStatut:event.target.value})}>
							<option value="intial">Statut initial</option>
							<option value="normal">normal</option>
							<option value="ADMIN">Admin</option>
						</select>

            		    			<button className="btn btn-success" type="submit" id="changeAdmin" 
						value="Changer">Changer</button>
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
export default withFirebase(ModalPopUpAdmin);
