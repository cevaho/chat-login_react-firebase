import React, {Component} from 'react';

import { PasswordForgetForm } from './auth/PasswordForget';
import PasswordChangeForm from './auth/PasswordChange';
import { Modal } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './session/Session-index';


class Account extends Component {

	constructor(props) {
	    super(props);

		console.log("mon authuser = ");
		console.log(this.props);

		this.handleShow = this.handleShow.bind(this);
    		this.handleClose = this.handleClose.bind(this);

	    this.state = {
	      text:"", 
	      messages:[],
	      show: null,
	      newid:"",
	      newtext:"",
	      loading: false,
		}
	}

	getMessages=()=>{
			// récriture de let messagesDB=this.props.firebase.database().ref("messages/"); 
			// dans la class firebase pour donner:
			// let messagesDB=this.props.firebase.messages(); 

			// écoute l'event de modif de la db des messages pour les charger
			// fetch les données de la DB firebase API relative à tous les messages 
			// messages renvoyés sous forme d'objet dont on va prendre l'id et le text
			// on changera le state qui contiendra un array avec tous les messages, 
			// et l'information de fin de chargement

			/*
			this.props.firebase.messages().on("value",snapshot=>{
							let newMessages=[];
							snapshot.forEach(child=>{
										let message=child.val();
										   console.log(message);console.log(child.id);
										newMessages.push({id:child.id,text:message.text})
										   console.log(newMessages);
										});
							this.setState({messages:newMessages,loading:false});
							});
			*/
			
			// autre méthode :
			this.props.firebase.messages().on('value', snapshot => {
										const usersObject = snapshot.val();
										// console.log(usersObject);
									// affichera les messages récents en top avec reverse()

										if(usersObject!==null){
										const usersList = Object.keys(usersObject)
												     .reverse()
												     .map(key => ({
        												     ...usersObject[key],
        													uid: key,
        													  })
													  );
							this.setState({messages:usersList,loading:false});
							console.log(usersList);
							}
    							});
			
			};
  

  	// fonctions de fermeture et ouverture de pop-up par changement d'état bootstrap
	handleClose() {
	    this.setState({ show: null });
	}
	handleShow(id) {
		console.log(id);
	    this.setState({ show: id });
	}

	// fonction de suppression de message dans la DB
	deleteFromDB = (idMessage) => {
				console.log("tentative de suppresion du message");
				this.props.firebase.message(idMessage).remove();
				this.handleClose();
			};

	// fonction d'edition d'un message
	editFromDB = (idMessage,messageContenu) => {
			console.log("idMessage = "+idMessage+" messageContenu = "+messageContenu);
				//let messageId = this.props.firebase.db.ref(`messages/${idMessage}`);
				//this.props.firebase.message(idMessage).child(/text/).update(messageContenu);
				this.props.firebase.message(idMessage).update({text:messageContenu});
			//this.handleClose();
			};

	componentDidMount(){
		this.getMessages();
		

		//check si displayname est dans la DB ou si il y a un bug
		//let displayName=this.props.firebase.auth.currentUser.displayName;
		//console.log(displayName);

		// console.log("email : "+this.props.firebase.auth.currentUser.email);
		// console.log(JSON.stringify(this.props.firebase.auth.currentUser));
		// console.log("big array de current user dans la db auth "+this.props.firebase.auth.currentUser);
		// console.log("current user id "+this.props.firebase.auth.currentUser.getDisplayName());
	};

	// désactive l'évènement au changement de component pour éviter les problèmes de mémoire
	componentWillUnmount() {
	   	// this.getMessages().messagesDB.off();
		this.props.firebase.messages().off();
	};

   // fonction qui renvoie les messages contenus dans le state pour les afficher dans le html quand le component a été monté
	// par un mapping des cases de l'array messages[] qui créé un objet par case avec ses propriétés et valeurs
	// affichage des 15 derniers messages en slican l'array
	renderMessages=()=>{
		return this.state.messages.slice(0,15).map(message=>(
			<span>{
			message.username === this.props.firebase.auth.currentUser.displayName
			/*message.username ==="lila"*/
				 && (
			<li key={message.uid} className="row">
				<span className="col-8">
					<span className="texter"><span className="aroz">&rArr;</span> {message.text}</span><br /> 
					<span className="smaaler">le {message.date}</span>
				</span>
				<span className="col-4">
			<div>
					<span className="spaner1"><button className="btn btn-success"
						onClick={() => { this.handleShow('Modifier'+message.uid)}}>Modifier</button>
					</span>
					<span className="spaner2"><button className="btn btn-danger"
						onClick={() => { this.handleShow('Supprimer'+message.uid)}}>supprimer</button>
					</span>

		       <Modal show={this.state.show === 'Modifier'+message.uid} onHide={this.handleClose}>
		        	<Modal.Header closeButton closeLabel="close window">
					<Modal.Title>Editer un message</Modal.Title>
				</Modal.Header>
		        	<Modal.Body>
					<p>Voulez-vous éditer ce contenu ?</p>
				<form action="/" onSubmit={(event)=>{this.onSubmitNew(event,message.uid)}} id="formulaire_new">

			    		<input type="text" name="newmessage" id="newmessage" 
					placeholder={message.text} size="50" autoFocus 
					onChange={event=>this.setState({newtext:event.target.value,newid:message.uid})}
					value={this.state.newtext}/>

            		    		<button className="btn btn-success" type="submit" id="envoi_newmessage" 
						value="modifier">Modifier le message</button>
        			</form>
				</Modal.Body>
				<Modal.Footer><button variant="primary" onClick={this.handleClose}>fermer</button>
				</Modal.Footer>
		       </Modal>

		       <Modal show={this.state.show === 'Supprimer'+message.uid} onHide={this.handleClose}>
		        	<Modal.Header closeButton closeLabel="close window">
					<Modal.Title>Supprimer définitivement</Modal.Title>
				</Modal.Header>
		        	<Modal.Body>voullez-vous vraiment supprimer ce message ?</Modal.Body>
				<Modal.Footer>
						    <button variant="secondary" 
								onClick={this.deleteFromDB.bind(this,message.uid)}>
						      OUI</button>
						    <button variant="primary" onClick={this.handleClose}>non</button>
						  </Modal.Footer>
		       		</Modal>
		</div>
			</span>
			</li>)}</span>
		));
	}


  render() {
	const { loading } = this.state;

    return (
      <div className="row">
        <h1 className="col-12">&#x022C6; Mon compte &#x022C6;</h1>
	{loading && <div>Loading ...</div>}
	<div className="account col-12 col-md-5">
		<Accounter />
	</div>
	<div className="account col-12 col-md-7">
		<h2>Mes messages envoyés :</h2>
		<ul className="messenger">
			{this.renderMessages()}
		</ul>
	</div>
      </div>
    );
  }
}

/*function Account() {
  return (
transformé pour afficher le contenu en fonction du contexte d'authentification
*/
const Accounter = () => (
  <AuthUserContext.Consumer>
    {authUser => (
	<div>
		<h2>Accès :</h2>
		<div>
			<h3>Vous désirez changer votre mot de passe ?</h3>       
			<PasswordChangeForm />
		</div>

		<div> 
			<h3>Mot de passe oublié ?</h3>
			<PasswordForgetForm />
		</div>
	</div>
    )}
  </AuthUserContext.Consumer>
  );
//}

// condition identique à const condition = authUser => authUser != null;
// authUser doit être différent de null
const condition = authUser => !!authUser;

// export du compenent en fonction de la condition d'authification

export default withAuthorization(condition)(Account);
