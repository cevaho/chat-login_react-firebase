import React, {Component} from 'react';
import { withAuthorization } from './session/Session-index';
// import { withFirebase } from './auth/firebase/context';
// import * as firebase from 'firebase';
//import * as ROLES from './auth/Roles';
import { Modal } from 'react-bootstrap';

class chat extends Component {

	constructor(props) {
	    super(props);

		console.log("mon authuser = ");
		console.log(this.props);
		console.log(!!this.props.authUser.roles.ADMIN);

		this.handleShow = this.handleShow.bind(this);
    		this.handleClose = this.handleClose.bind(this);

	    this.state = {
	      text:"", 
	      messages:[],
	      date: new Date().toLocaleDateString("fr-FR", 
			{weekday: "long", year: "numeric", month: "long",day: "numeric",hour:"numeric",minute:"numeric"}),
	      show: null,
	      newid:"",
	      newtext:"",
	    };
	}


	// fonction qui va faire appel a la database de firebase
	// dont la référence sera messages
	// et poussera le contenu du message càd la valeur du state reçu depuis l'input du formulaire
	writeMessageToDB=(message,dater)=>{

				this.props.firebase.messages()
				.push({username:this.props.firebase.auth.currentUser.displayName,text:message,
					date:dater})
			     };


	onSubmit = (event)=>{
			   console.log("tentative d'envoi de message");

			   // gestion de la date d'envoi du message
			   	/*let dater = new Date();
			   	let options = {weekday: "long", year: "numeric", month: "long", 
						day: "numeric",hour:"numeric",minute:"numeric"};
			   	let dateFR = dater.toLocaleDateString("fr-FR", options);*/

				// console.log(" date FR = "+dateFR);
				// datefr est un string : console.log(typeof dateFR);

			   	//this.setState({date:dateFR,});
				//console.log("date = "+this.state.date);

			   // si le champs n'est pas vide
			   // active la fonction d'envoi du message dans la DB
			   // remet l'état text a zéro pour le message suivant
			   	if(this.state.text.trim()!==""){
					this.writeMessageToDB(this.state.text,this.state.date);
					this.setState({text:"",});
					console.log("message text : "+this.state.text);					
			   	}

				// empeche le rechargement de la page
				event.preventDefault();
				console.log("message text : "+this.state.text);
			   };

	onSubmitNew = (event,idMessage) => {
			
			if(this.state.newtext.trim()!==""){
					//console.log("mon id messages"+idMessage);
					//console.log("mon nouveau text "+this.state.newtext);
					this.editFromDB(idMessage,this.state.newtext)
					this.setState({newtext:"",});					
			   	}
				// empeche le rechargement de la page
				event.preventDefault();
				this.handleClose();
			   };


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
									// affichera les message récent en top avec reverse()

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
			<li key={message.uid} className="row">
				<span className="col-8">
					<span className="texter"><span className="aroz">&rArr;</span> {message.text}</span><br /> 
					<span className="smaaler">de {message.username}, le {message.date}</span>
				</span>
				<span className="col-4">
				{/*
				message.username === this.props.firebase.auth.currentUser.displayName 
				 && (<p>auteur</p>)

				si x ou y alors nécessite une condition ternaire avec else vide x || y ? resultat : ""
				on peut pas utiliser condition && résultat*/
				message.username === this.props.firebase.auth.currentUser.displayName ||
				!!this.props.authUser.roles.ADMIN ? (
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
				):""}
			</span>
			</li>
		));
	}


	render() {
	    return (
	      <div className="row">
		<h1 className="col-12">&#x022C6; Les commentaires à propos du site &#x022C6;</h1>
	      <div className="chater col-12 col-md-5">
			<h2>Ajoutez un commentaire !</h2>
			<form action="/" onSubmit={this.onSubmit} id="formulaire_chat" className="review-form">
			<div className="input-group">
			    <input type="text" name="message" id="message" placeholder="Votre commentaire..." size="50" autoFocus 
				onChange={event=>this.setState({text:event.target.value})}
				value={this.state.text} className="lead search form-control"
			    />
			    <div className="input-group-append">
            		    <button className="btn lead btn-info"type="submit" id="envoi_message" value="Envoyer">
				Ajouter</button></div></div>
        		</form>
	      </div>
	      <div className="chater col-12 col-md-7">
			<h2>Les commentaires pécédents :</h2>
			<ul className="messenger">
				{this.renderMessages()}
			</ul>
		
	      </div></div>
		
	    );
  	}
}

// condition identique à const condition = authUser => authUser != null;
// authUser doit être différent de null ou plutot doit etre egal a true
const condition = authUser => !!authUser;

// export du compenent en fonction de la condition d'authification

export default withAuthorization(condition)(chat);
