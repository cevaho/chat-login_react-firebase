import React, {Component} from 'react';
import { withAuthorization } from './../session/Session-index';

// permettra d'accepter une des deux réservations ayant des dates en commun : OK
import ModalPopUpAD from './../modal/modal-popup-accept-refused';

// permettra d'accepter ou de refuser une réservations OK
import ModalPopUpOne from './../modal/modal-popup-one-demand';

// supprimera la demande de la DB definitivement : OK
import ModalPopUpDel from './../modal/modal-popup-delete';

// change le statut entre booked, demande et refuse pour booked et refused
import ModalPopUpstat from './../modal/modal-popup-statut-change';

class reservationsList extends Component {

	constructor(props) {
	    super(props);

		//console.log("mon authuser = ");
		//console.log(this.props.authUser);
		//console.log(!!this.props.authUser.roles.ADMIN);

	   this.state={booking:[],dejaDemande:[],reservations:[],betweener:[],loading:false,unedesdeuxdates:[],refuse:[]};
	}


/*** gestion de réception des réservation dans la DB ***/


	// fonction à activer pour ajouter indexer lié au nombre de case et pas l'id 
	// de chaque range au cas ou on supprime des ranges plus tard
	// en clé valeur pour être comparé par la suite dans un loop des nouvelles dates choisies
	/*traiteForArrays=(arrays)=> {
	    			for (var[index,value] of arrays.entries()){
						// création de la clé indexer dans chaque objet et de sa valeur = à index
						value.indexer = index;
				    	};
	  			};*/

	// fonction servant à retrouver la position d'une date from dans l'array onDemande
	// si la position est multiple, indexons sera supérieur à 1
	/*checkDateInObject=(array,find)=>{
				var items = array;
				var indexons = 0;
				for(var i = 0; i < items.length; i++) {

					var stringer=items[i].from.toString();

					    if(stringer === find) {
						indexons += 1;
					    }
				}
				return indexons;
			}*/

	// fonction qui place les nouvelles dates dans un objet pour le pousser dans un array
	/*getBetweenDates=(startDate,endDate)=>{
				let objectRange={"from":startDate,"to":endDate};
				return objectRange;
			};*/

	// fonction qui supprime les dates du tableau onDemand qui se trouvent aussi dans uneDesDeuxDates
	singleDemand = (array1,array2) => {
			
			/* 

				 array1 model:["date1":{"uidFrom":uidVal,"username":userVal,"from":fromVal,"to":toVal},
					       "date2":{"uidFrom":valaUid,"username":valaUser,"from":valaFrom,"to":valaTo},
					       "between":{"from":fromVal,"to":toVal}]

				 array2 model : [{from:froma,to:toa,username:name,uid:ider}] 

			*/
				//console.log("array1 "+JSON.stringify(array1)+" array2 "+JSON.stringify(array2));
				
				let arrayMixed = [];
				let arrayDemandSingle = [];

				for(let [index,arra] of array1.entries()){
					let key1 = arra.date1.uidFrom;
					let key2 = arra.date2.uidFrom;
					arrayMixed.push(key1,key2);
				}

				for(let [index,arry] of array2.entries()){
					let key3 = arry.uid;
					if(arrayMixed.indexOf(key3)===-1){
									arrayDemandSingle.push(arry);
									}
				}

			  //console.log("arrayMixed "+JSON.stringify(arrayMixed));
			  //console.log("arrayDemandSingle "+JSON.stringify(arrayDemandSingle));
			  return arrayDemandSingle;	
	}
	

	// vérifie si les dates comprennent des dates déjà demandées (pas le même .from)
	// si c'est le cas un array va contenir les dates comprises entre 2 ranges
	goBetween=(array)=>{
			let arrayBetween=[];
			for(let[index,value] of array.entries()){

						let fromVal=value.from;let toVal=value.to;
						let uidVal=value.uid;let userVal=value.username;
								
						// check chaque ligne de l'array 
						// pour chaque ligne du précédent array
						for(let[indexa,valuea] of array.entries()){

							if(index!==indexa){
								let valaFrom=valuea.from;let valaTo=valuea.to;
								let valaUid=valuea.uid;let valaUser=valuea.username;
								
			switch(true) {
					// date.debut et date.fin comprises dans le range
					// date.debut après date-comparée.debut, date.fin avant date-comparée.fin
					// répétitif avec le case 4 mis en commentaire
					case (fromVal > valaFrom && toVal < valaTo):
						//console.log("case 1 > <");
					arrayBetween.push({
							"date1":{"uidFrom":uidVal,"username":userVal,"from":fromVal,"to":toVal},
							"date2":{"uidFrom":valaUid,"username":valaUser,
									"from":valaFrom,"to":valaTo},
							"between":{"from":fromVal,"to":toVal}
							});
					//arrayBetween.push({"partageDu":valaFrom,"from":fromVal,"to":toVal,"partageAu":valaTo});
			//arrayBetween.push(this.getBetweenDates(fromVal,toVal));
			//console.log("fromVal "+fromVal+" > valaFrom "+valaFrom+" && toVal"+toVal+" < valaTo "+valaTo);
					break;

					// date.debut est comprise dans le range
					// date.debut après date-comparée.debut et date.fin après date-comparée.fin
					// mais date.debut doit aussi etre dans le range donc < que date-comparée.fin
					// répétitif avec le case 3 mis en commentaire
					case (fromVal > valaFrom && fromVal < valaTo && toVal > valaTo):
						//console.log("case 2 > < >");
					arrayBetween.push({
							"date1":{"uidFrom":uidVal,"username":userVal,"from":fromVal,"to":toVal},
							"date2":{"uidFrom":valaUid,"username":valaUser,
									"from":valaFrom,"to":valaTo},
							"between":{"from":fromVal,"to":valaTo}
							});
			//arrayBetween.push(this.getBetweenDates(fromVal,valaTo));
			//console.log("fromVal "+fromVal+" > valaFrom "+valaFrom+" && toVal"+toVal+" > valaTo "+valaTo);
					break;

					// si les dates sont identiques
					case(fromVal.toString()===valaFrom.toString() && toVal.toString()===valaTo.toString()):
						//console.log("case 5 = =");
					arrayBetween.push({
							"date1":{"uidFrom":uidVal,"username":userVal,"from":fromVal,"to":toVal},
							"date2":{"uidFrom":valaUid,"username":valaUser,
									"from":valaFrom,"to":valaTo},
							"between":{"from":fromVal,"to":toVal}
							});
			//arrayBetween.push(this.getBetweenDates(fromVal,valaTo));
			//console.log("fromVal "+fromVal+" > valaFrom "+valaFrom+" && toVal"+toVal+" > valaTo "+valaTo);
					break;

					default:;
			}
									} //fin if
						} //fin foreach value of array			
					}
			let arrayBetweenDedup = this.dedupe(arrayBetween);
				//console.log(JSON.stringify(arrayBetweenDedup));
			return arrayBetweenDedup;
		      }


	
	// fonction qui va supprimer les doublons dans un objet de plusieurs arrays
	dedupe=(array) => {
		// console.log("array zero "+JSON.stringify(array[0]))
		// dedouble le grand array avec deux dates leur user id, etc dans le if
		// autrement le petit array avec les date between
		// if(array[0].date1){
				return array.reduce(

					function (p,c) {
							//console.log("C = "+JSON.stringify(c));
				    			let key1 = c.date1.uidFrom;let key2= c.date2.uidFrom;
								 //console.log("key1 = "+key1+" key2 "+key2);


							if (p.temp.indexOf(key1) === -1 && p.temp.indexOf(key2) === -1) {
							      				p.out.push(c);
							      				p.temp.push(key1);p.temp.push(key2);
							    				}
				    			return p;
				  			},

					{ temp: [], out: [] }
							)
				.out;
		//} //fin if


		/*else{

  		//renvoie une valeur après traitement de chaque case de l'array, 
		//ici p.out nouvel array de date sans doublon

  		return array.reduce(

			// reduce impose une fonction de callback a exécuter sur chaque élément de l'array
			// l'argument p en première position est l'accumulateur, 
			// c'est la valeur renvoyée en résultat par la fonction
			function (p,c) {
					// la fonction de callback prend l'argument en seconde position 
					// comme valeur actuelle ici
					// l'array contenant les valeurs de propriété from et to 
					// pour la case de l'array list nommée "c"
		    			var key1 = new Date(c.range.from).getTime();
					var key2 = new Date(c.range.to).getTime();
						 //console.log("key1 = "+key1+" key2 "+key2);

						// "c" contient la case de l'array séléctionnée par le loop del'array list
						// console.log("c = "+JSON.stringify(c));
						// p est un objet contenant des arrays temp et out, 
						// vide dans un premier temps et définit par la valeur initiale 
						// plus bas dans le code
						// console.log("p = "+JSON.stringify(p));

					// si les valeurs de key n'ont pas de position indexée dans l'array temp de p
					// on pousse l'objet c (case de l'array) dans l'array out de p
					// on pousse les valeurs de key dans temp de p ce qui permettra 
					// de ne pas le pousser dans out si key est indexée et donc présente dans temp
					if (p.temp.indexOf(key1) === -1 && p.temp.indexOf(key2) === -1) {
					      				p.out.push(c);
					      				p.temp.push(key1);p.temp.push(key2);
					    				}
		    			return p;
		  			},
		 	// valeur initiale imposée par reduce pour activer la fonction aussi sur le premier élément de l'array
			{ temp: [], out: [] }
					)
			// de l'array reduce renvoyé on ne prend que le .out de l'objet, donc p.out
			.out;
		} //fin else*/
	}	


	/*mixTwoArrays = (array1,array2) =>{
			
			console.log("array1 "+JSON.stringify(array1));
			console.log("array2 "+JSON.stringify(array2));
			for(let arra of array1.entries()){
				console.log("arra "+JSON.stringify(arra));
				for(let arro of array2.entries()){
						if(arra.date1.uidFrom === arro.idFrom){
					console.log("arra.date1.uidFrom"+arra.date1.uidFrom+"arro.idFrom"+arro.idFrom);
							}
						}
				}

	};*/


	// place les dates dans différents tableaux booked ou demande en fonction du statut demande ou booked
	// ensuite ces arrays sont placés dans des states utilisés pour les css des dates dans le calendrier
	traiteLesDates=(arrayDates)=>{

			let arrayBooked = [];
			let arrayDemande = [];
			let arrayRefuse = [];

			for(let [index,arraDate] of arrayDates.entries()){
				console.log(index);

				let ider=arraDate.uid;
				let name=arraDate.username;
				let froma=new Date(arraDate.range.from);
				let toa=new Date(arraDate.range.to);				
				//let froma="glup";let toa="";

				if(arraDate.statut==="demande"){
					arrayDemande.push({from:froma,to:toa,username:name,uid:ider});
					}
				else if(arraDate.statut==="refuse"){
					arrayRefuse.push({from:froma,to:toa,username:name,uid:ider});
					}
				else{
					let fromu=new Date(Number(arraDate.range.from)); 
					let tou=new Date(Number(arraDate.range.to));
					//let fromu="";let tou="";
					arrayBooked.push({from:fromu,to:tou,username:name,uid:ider});
					}
				}

			    // ajout d'indexer à chaque array
				//this.traiteForArrays(arrayDemande);
				//this.traiteForArrays(arrayBooked);

			    // traite arrayDemande pour y checker les dates demandées plusieures fois par différentes personnes
				// var twicing=this.goTwice(arrayDemande);
				let betweeners=this.goBetween(arrayDemande);
				 //console.log("betweeners "+JSON.stringify(betweeners));

				let demandSansUneDesDeux = this.singleDemand(betweeners,arrayDemande);
					//console.log("demandSansUneDesDeux "+JSON.stringify(demandSansUneDesDeux));

				// .from() est une méthode qui construit un array avec des valeurs, 
				// transforme l'objet créé par set en un array pour pouvoir être mappé
				/*let betwinering = Array.from(
							new Set(
								// le map créé un tableau avec le résultat 
								// de la fonction appliquée sur chaque ligne du tableau
								// la fonction renvoie chaque valeur de propriété between
								// et pas date1 et date2
								betweeners.map(s => {return {"range":s.between,"idFrom":s.date1.uidFrom}})
								)
							);*/
				//console.log("betwinering selection de date between du grand array"+JSON.stringify(betwinering));

				//let reducBetweeners=this.dedupe(betwinering);
				//console.log("reducBetweeners suppresion des doublons de betwinering "+JSON.stringify(reducBetweeners));
				//let arrayDemandeDedubled = this.dedupe(betweeners);
					//console.log("arrayDemandeDedubled "+JSON.stringify(arrayDemandeDedubled));

				//let zeBigOne = this.mixTwoArrays(arrayDemandeDedubled,reducBetweeners);

			this.setState({dejaDemande:demandSansUneDesDeux,booking:arrayBooked,
					// betweener:reducBetweeners,
					unedesdeuxdates:betweeners,refuse:arrayRefuse},
									()=>{
	//console.log("between dates reduced en state"+JSON.stringify(this.state.betweener));
									    });

			}

	// place en state la copie de la DB réservations, dans une array traité ensuite pour séparer booked de demande
	// avec fonction de callback qui ne s'active que lorsque le state est vraiment modifié (résout le probleme asynchrone)
	getReservations=()=>{
			this.props.firebase.reservations()
				.on('value', snapshot => {
							const usersObject = snapshot.val();
										if(usersObject!==null){
										const reservationList = Object.keys(usersObject)
												     .map(key => ({
        												     ...usersObject[key],
        													uid: key,
        													  })
													  );
							this.setState({reservations:reservationList}, 
									() => {
				//console.log("get reservation state.reservations = "+JSON.stringify(this.state.reservations));
										this.traiteLesDates(this.state.reservations);
										}
									);
							}
    							});
			}


	/*** GESTION affichage des dates réservées, interdites ou en attentente ***/
   	componentDidMount() {
		this.setState({ loading: true });
	    	this.getReservations();
		this.setState({ loading: false });
  	}

	// désactive l'évènement au changement de component pour éviter les problèmes de mémoire
	componentWillUnmount() {
		this.props.firebase.reservations().off();
	};


	render() {
		const { booking,dejaDemande,unedesdeuxdates, loading,refuse } = this.state;
		
	    return (
	     
	      <div className="col-12 reserva">
		{loading && <div className="row">
			<div>Loading ...</div>
	        </div>}
	        <div className="row">
			<MelangeDeuxDates unedesdeuxdates={unedesdeuxdates} />
			<DemandeList dejaDemande={dejaDemande} />
	        </div>
	        <div className="row">
			<BookedList booking={booking} />
			<RefusedList refuse={refuse} />
		</div>
	    </div>
	    );
  	}
}

const BookedList = ({ booking }) => (
			<div className="col-12 col-md-6">
			<h4>Réservations confirmées :</h4>
			<ul>
				{booking.map(booking => (
				      <li key={booking.uid} className="reder row">
					<div className="col-12 col-md-7">
					<span>Réservé par : <strong> {booking.username}</strong></span><br />
					<span> du : <strong>{booking.from.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</strong></span>  
					<span> au : <strong>{booking.to.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</strong></span>
					</div>
					<div className="col-12 col-md-5">
						<ModalPopUpstat dateAccepted={booking.uid} 
								username={booking.username} 
								dateFrom={booking.from} 
								dateTo={booking.to}></ModalPopUpstat>
					</div>
				      </li>
				 ))}
			</ul>
			</div>
);

const DemandeList = ({ dejaDemande }) => (
			<div className="col-12 col-md-6 attente">
			<h4>Réservations en attente :</h4>
			<ul>
				{dejaDemande.map(dejaDema => (
				      <li key={dejaDema.uid} className="oranger row">
					<div className="col-12 col-md-7">
						<span>Demandé par : <strong> {dejaDema.username}</strong></span><br />
					<span> du : <strong>{dejaDema.from.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</strong></span>  
					<span> au : <strong>{dejaDema.to.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</strong></span>
					</div>
					<div className="col-12 col-md-5">
						<ModalPopUpOne dateAccepted={dejaDema.uid}
						 		username={dejaDema.username} 
								dateFrom={dejaDema.from} 
								dateTo={dejaDema.to}
						></ModalPopUpOne>
					</div>
				      </li>
				 ))}
			</ul>
			</div>
);

const MelangeDeuxDates = ({ unedesdeuxdates }) => (
			<div className="col-12 col-md-6">
			<h4>Plusieurs demandes pour les mêmes dates :</h4>
			<ul>
				{unedesdeuxdates.map(uneDesDeux => (
				      <li key={uneDesDeux.date1.uidFrom}  className="row sameDates">
					<div className="col-12 pinker">
					   <span>Dates en commun :</span><br />
					   <span className="bolder">du {uneDesDeux.between.from.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})} au {uneDesDeux.between.to.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</span>
					</div>
					<div className="col-12">
					<div className="row">
					<div className="col-6 col-md-6">
					   <span>A) Demandée par : <br /><strong> {uneDesDeux.date1.username}</strong></span><br />
					   <span> du : <strong>{uneDesDeux.date1.from.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</strong></span>  
					   <span> au : <br /><strong>{uneDesDeux.date1.to.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</strong></span>
					   <ModalPopUpAD dateAccepted={uneDesDeux.date1.uidFrom} dateDenied={uneDesDeux.date2.uidFrom}></ModalPopUpAD>
					</div>
					<div className="col-6 col-md-6">
					   <span>B) Demandée par : <br /><strong> {uneDesDeux.date2.username}</strong></span><br />
					   <span> du : <strong>{uneDesDeux.date2.from.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</strong></span>  
					   <span> au : <br /><strong>{uneDesDeux.date2.to.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</strong></span>
					   <ModalPopUpAD dateAccepted={uneDesDeux.date2.uidFrom} dateDenied={uneDesDeux.date1.uidFrom}></ModalPopUpAD>
					</div>
					</div></div>
				      </li>
				 ))}
			</ul>
			</div>
);

const RefusedList = ({ refuse }) => (
			<div className="col-12 col-md-6">
			<h4>Réservations annulées :</h4>
			<ul>
				{refuse.map(refu => (
				      <li key={refu.uid} className="greyer row">
					<div className="col-12 col-md-7">
					<span>Demandée par : <strong> {refu.username}</strong></span><br />
					<span> du : <strong>{refu.from.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</strong></span>  
					<span> au : <strong>{refu.to.toLocaleDateString("fr-FR",{day: "numeric",month: "long",year: "numeric"})}</strong></span>
					</div>
					<div className="col-12 col-md-5">
						<ModalPopUpstat dateAccepted={refu.uid}
							username={refu.username} dateEnvoi={refu.dateEnvoi} 
							dateFrom={refu.from} dateTo={refu.to}
						></ModalPopUpstat>
						<ModalPopUpDel dateAccepted={refu.uid}></ModalPopUpDel>
					</div>
				      </li>
				 ))}
			</ul>
			</div>
);

// condition identique à const condition = authUser => authUser != null;
// authUser doit être différent de null ou plutot doit etre egal a true
const condition = authUser => !!authUser;

// export du compenent en fonction de la condition d'authification

export default withAuthorization(condition)(reservationsList);
