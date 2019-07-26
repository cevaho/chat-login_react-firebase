import React, {Component} from 'react';
import { withAuthorization } from '../../session/Session-index';
import DayPicker, { DateUtils } from 'react-day-picker';
//import FormDay from './FormDay';
//import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import fusionBooked from './deuxDatesSeSuivent.js';


/*** Gestion du format des dates et langage du formulaire ***/
	const WEEKDAYS_LONG = {
	  fr: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi',],
	};
	const WEEKDAYS_SHORT = {
	  fr: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
	};
	const MONTHS = {
	  fr: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre',],
	};
	// samedi comme premier jour de la semaine
	const FIRST_DAY = {fr: 6,};

	function formatDay(d, locale = 'fr') {
	  return `${WEEKDAYS_LONG[locale][d.getDay()]}, ${d.getDate()} ${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`;
	}

	function formatMonthTitle(d, locale = 'fr') {
	  return `${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`;
	}

	function formatWeekdayShort(i, locale) {
	  return WEEKDAYS_SHORT[locale][i];
	}

	function formatWeekdayLong(i, locale) {
	  return WEEKDAYS_SHORT[locale][i];
	}

	function getFirstDayOfWeek(locale) {
	  return FIRST_DAY[locale];
	}

	const localeUtils = {
	  formatDay,
	  formatMonthTitle,
	  formatWeekdayShort,
	  formatWeekdayLong,
	  getFirstDayOfWeek,
	};


/*** GESTION DES STYLES DU CALENDRIER ***/

  // style css contenu dans une variable et ajoutée dans le jsx par appel de cette variable
  const Styler='';

		/*
		  // modification du style du jour par une fonction appelée dans le jsx qui va ajouter une class à ce jour
		  const modifiers = {
			highlighted: new Date(),
			sundays: { daysOfWeek: [0] },
			booked:{from: new Date(2019, 6, 12),to: new Date(2019, 6, 16) }
		  };
		*/

	  // pour ajouter des styles en dehors de la balise style, dans la balise
	  const modifiersStyles = {
	    sundays: {
	      color: '#ffc107',
	    },
	    booked:{
		backgroundColor:'red',borderRadius: 0,
	    },
	  };

  // date du jour pour comparaison et désactiver les jours d'avant
  const today = new Date();



class DatePicker extends Component {


  constructor(props) {
    super(props);

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);

    /*this.state = {selectedDay: undefined,};*/
    this.state = this.getInitialState();
    this.state={booking:[],dejaDemande:[],reservations:[],betweener:[],dater:new Date().getTime(),demandeFaite:false};
  }

  getInitialState() {
    return {
      from: undefined,
      to: undefined,
    };
  }


/*** GESTION demande RESERVATION ***/

 // fonction qui envoie les infos du form dans la DB firebase
    addReservationToDB=(ranger,dater)=>{
		console.log("addreservation activé");
		//console.log(this.props.firebase.auth.currentUser.displayName+" "+ranger.from+" "+ranger.to+" "+dater)
				this.props.firebase.reservations()
				.push({username:this.props.firebase.auth.currentUser.displayName,statut:"demande",
					range:ranger,dateEnvoi:dater});

				this.setState({demandeFaite:true});
				//this.getInitialState();
				this.setState({from:undefined,to:undefined}, 
									() => {
						console.log("state apres initialisation undefined ?"+this.state.to);
										this.getReservations();
										}
				);
				
			     };

  // onsubmit du button pour envoi des réservations vers la db
  onSubmit = ()=>{
		console.log("onSubmit activé");
		if(this.state.from!==undefined && this.state.to!==undefined){
					console.log("tentative d'envoi de réservation");
					//console.log("this.state.from "+new Date(this.state.from).getTime());
					//console.log("this.state.to "+new Date(this.state.to).getTime());

					// création de l'objet à placer dans la clé range pour le json de la DB
	    				let ranger={"from": new Date(this.state.from).getTime(),
						    "to": new Date(this.state.to).getTime()};
					console.log("ranger = "+JSON.stringify(ranger));
					//console.log(this.state.dater);
					this.addReservationToDB(ranger,this.state.dater);
		}
  };


/*** GESTION selection de date au clic ***/

		/*https://stackoverflow.com/questions/17304426/javascript-date-range-between-date-range
		http://react-day-picker.js.org/docs/matching-days/*/

  // pour la sélection de dates multiples (range)
 	// booked et  disabled renvoient une boléenne
  	// handleDayClick(day,{disabled,booked}) {


		// fonction hors du loop mais utilisée dans le loop 
		// pour contenir la valeur des propriétés de l'objet book, dont l'indexer= l'index dans le for each
		// cela permet de comparer les dates de début et de fin des réservations déjà effectuées
		findFrom = (index,array) =>{
				return array.find(x => x.indexer === index).from
				}

		findTo = (index,array) =>{
					return array.find(x => x.indexer === index).to
					}

  handleDayClick(day,modifiers) {

	//permet la sélection de date multiples
    	const range = DateUtils.addDayToRange(day, this.state);

    			//console.log(booked); = true
    			//console.log(modifiers.booked); = true
				//console.log("from = "+this.state.from);console.log("to = "+this.state.to); = undefined à cet instant
				//console.log("range.from "+range.from);console.log("range.to "+range.to);

	// comparaison des dates, si le range comprend des dates déjà réservées, 
	// si date de début < que date début résevée, la sélection s'arrête à la date précédant la date réservée
		let rangFromer=range.from;let rangToer=range.to;
		let book=this.state.booking;
		//console.log("book"+JSON.stringify(book));
		
		//for(let key=1;key<=book.length;key++){
		// for each in array en es6 :
		for(var [index] of book.entries()){
			
			//variable contenant from et to dont l'index est égal à indexer
			let fromer= this.findFrom(index,book);let toer= this.findTo(index,book);
				//console.log("fromer = "+ fromer);console.log("toer = "+ toer);
				//console.log(" value.indexer: "+index+" value from: "+value.from+" value to: "+value.from);

			
			// si le range contient des dates déjà réservée
			// ou si la date de fin du range est comprise dans une date déjà réservée
			// la date de fin du range est egal à une journée avant la date de début déjà réservée
			if(
				rangFromer <= fromer && rangToer >= toer
				||
				rangFromer <= fromer && rangToer >= fromer && rangToer <= toer
				){
					//console.log("date definie entourant date interdite");
					//console.log("fromer "+fromer);

				let beforeFromer = new Date(fromer-= 24*3600*1000);
					//console.log("secondes formatées en date = "+beforeFromer);
					//return;
				range.to=beforeFromer;
					//place le range en state
				this.setState(range);
				// met fin à la sélection de date
				return;
								    }
			//if(rangFromer <= fromer && rangToer >= fromer && rangToer <= toer){
				//}
			
		}

    // si modifier disabled ou modifier booked, empeche la sélection des dates déja réservées ou disabled
    if (modifiers.disabled || modifiers.booked) {
      return;
    }
    // donne en state from et to contenu dans la variable range
    this.setState(range);
  }

  // suppression de la date sélectionnée par ré-initialisation du state
  handleResetClick() {
    	this.setState(this.getInitialState());
  }



/*** gestion de réception des réservation dans la DB ***/


	// fonction à activer pour ajouter indexer lié au nombre de case et pas l'id 
	// de chaque range au cas ou on supprime des ranges plus tard
	// en clé valeur pour être comparé par la suite dans un loop des nouvelles dates choisies
	traiteForArrays=(arrays)=> {
	    			for (var[index,value] of arrays.entries()){
						// création de la clé indexer dans chaque objet et de sa valeur = à index
						value.indexer = index;
				    	};
	  			};

	// fonction servant à retrouver la position d'une date from dans l'array onDemande
	// si la position est multiple, indexons sera supérieur à 1
	checkDateInObject=(array,find)=>{
				var items = array;
				var indexons = 0;
				for(var i = 0; i < items.length; i++) {

					var stringer=items[i].from.toString();
					/*console.log("items[i].from "+items[i].from+"typeof "+typeof(items[i].from)+"stringé : "
							+stringer+"typeof "+typeof(stringer));*/

					    if(stringer === find) {
						indexons += 1;
						//break;
					    }
				}
				//console.log("indexons "+indexons);
				return indexons;
			}

	// place les dates identiques en double dans un array (même .from)
	// pour afficher une couleur différente pour toute demande de date identique à une autre demande
	/*goTwice=(array)=>{
			let arraytwice=[];
				//console.log("go twice : arrayDemand = "+JSON.stringify(array));
				//var find = "2019-08-17T10:00:00.000Z";
				//var find = "Sat Aug 17 2019 12:00:00 GMT+0200 (Central European Summer Time)";

			for(var[index,value] of array.entries()){

				//let fromar= this.findFrom(index,array);let toar= this.findTo(index,array);
					//console.log("fromar = "+fromar+" toar = "+toar);

					console.log("index"+index);
				let find=value.from.toString();
				let indexer=this.checkDateInObject(array,find);
					//console.log("indexons depuis foreach "+indexer);
				if(indexer>1){
					      arraytwice.push(value);
					     }

			     }
				return arraytwice;
			};*/

	getBetweenDates=(startDate,endDate)=>{
				//console.log("getbetweendays activé "+startDate+" "+endDate);

				let objectRange={"from":startDate,"to":endDate};

				/*for(var myDate = startDate; myDate <= endDate; 
					myDate = new Date(myDate.getTime() + 1000 * 60 * 60 * 24))
						{
						    /*var formatedDate = myDate.getMonth()+1;
						    formatedDate += "/" + myDate.getDate() + "/" + myDate.getFullYear();*/
						    /*console.log(myDate.getTime());
						    dates.push(myDate.getTime());
						}*/

				return objectRange;

				/*
				// Renvoie un array avec les dates séparées entre 2 dates
				let getDates = (startDate, endDate) => {
					  	let dates = [];
					  	let currentDate = startDate;console.log("currentDate "+currentDate);
						let addDays = (days) => {
									// valueof prend la valeur de l'objet qui lui sera assigné
									let date = new Date(this.valueOf());
									// définit la date avec le numero du jour du mois + 1
									date.setDate(date.getDate() + days);
									console.log("date "+date);
									return date;
						      			};

						// lorsque date.debut <= à date.fin
					  	while (currentDate <= endDate) {
										//ajoute date.debut au tableau
					    					dates.push(currentDate);
										// redéfinit la valeur de date.debut
										// en utilisant .call qui appel une méthode d'un
										// autre objet dans l'objet currentDate
					    					currentDate = addDays.call(currentDate, 1);
					  					}
					  	return dates;
				};

				// Usage
				var dates = getDates(new Date(2013,10,22),new Date(2013,10,22));
                                                                                                        
				dates.forEach(function(date) {
				  console.log(date);
				});
				*/
			};

	// vérifie si les dates comprennent des dates déjà demandées (pas le même .from)
	goBetween=(array)=>{
			//console.log("gobetween depart "+JSON.stringify(array));
			let arrayBetween=[];
			for(var[index,value] of array.entries()){
						//console.log("index"+index);
						let fromVal=value.from;let toVal=value.to;
								
						// check chaque ligne de l'array 
						// pour chaque ligne du précédent array
						for(var[indexa,valuea] of array.entries()){
							//console.log("index"+index+" indexa "+indexa);
							if(index!==indexa){
								let valaFrom=valuea.from;let valaTo=valuea.to;

								//console.log("fromVal  "+fromVal+" "+toVal);
								//console.log("valaFrom "+valaFrom+" "+valaTo);
								//console.log(fromVal.toString()+" "+toVal.toString());
								//console.log(valaFrom.toString()+" "+valaTo.toString());
								/*if(fromVal.toString()===valaFrom.toString()
									&& toVal.toString()===valaTo.toString())
									{console.log("yolooooooo");}*/
								
			switch(true) {
					// date.debut et date.fin comprises dans le range
					// date.debut après date-comparée.debut, date.fin avant date-comparée.fin
					// répétitif avec le case 4 mis en commentaire
					case (fromVal > valaFrom && toVal < valaTo):
			console.log("case 1 > <");
			arrayBetween.push(this.getBetweenDates(fromVal,toVal));
			//console.log("fromVal "+fromVal+" > valaFrom "+valaFrom+" && toVal"+toVal+" < valaTo "+valaTo);
					break;

					// date.debut est comprise dans le range
					// date.debut après date-comparée.debut et date.fin après date-comparée.fin
					// mais date.debut doit aussi etre dans le range donc < que date-comparée.fin
					// répétitif avec le case 3 mis en commentaire
					case (fromVal > valaFrom && fromVal < valaTo && toVal > valaTo):
			console.log("case 2 > < >");
			arrayBetween.push(this.getBetweenDates(fromVal,valaTo));
			//console.log("fromVal "+fromVal+" > valaFrom "+valaFrom+" && toVal"+toVal+" > valaTo "+valaTo);
					break;

					// si les dates sont identiques
					case(fromVal.toString()===valaFrom.toString() && toVal.toString()===valaTo.toString()):
			console.log("case 5 = =");
			arrayBetween.push(this.getBetweenDates(fromVal,valaTo));
			//console.log("fromVal "+fromVal+" > valaFrom "+valaFrom+" && toVal"+toVal+" > valaTo "+valaTo);
					break;
	
					// date.fin est comprise dans le range mais pas date.debut
					// date.debut avant date-comparée.debut fin avant date-comparée.fin
					/*case (fromVal < valaFrom && toVal < valaTo && toVal > valaFrom):
			console.log("case 3 < <");
			console.log("fromVal "+fromVal+" < valaFrom "+valaFrom+" && toVal"+toVal+" < valaTo "+valaTo);
					break;*/

					// date.debut et date.fin entourent le range
					// date.debut avant date-comparée.debut fin après date-comparée.fin
					/*case (fromVal < valaFrom && toVal > valaTo):
			console.log("case 4 < >");
			console.log("fromVal "+fromVal+" < valaFrom "+valaFrom+" && toVal"+toVal+" > valaTo "+valaTo);
					break;*/

					default:console.log("case default");
			}
								
									} //fin if
	
						} //fin foreach value of array			
					}
			return arrayBetween;
		      }

	// fonction qui supprime les objets en doublon dans l'array betweener
	reduceringer=(array)=>{
				let result = 
					//transforme l'array en objet
					Array.from(
					// set prend les valeurs unique de l'array
					new Set(array.map(s => s.from))).map(from=>{
						return{
							from:from,
							to:array.find(s => s.from ===from).to
							};
						});
				//console.log("results "+JSON.stringify(result));
				return result;
			}

	// place les dates dans différents tableaux booked ou demande en fonction du statut demande ou booked
	// ensuite ces arrays sont placés dans des states utilisés pour les css des dates dans le calendrier
	traiteLesDates=(arrayDates)=>{
				//console.log(" arraydate = "+JSON.stringify(arrayDates));
				//console.log("traite les dates activé : from = "+arrayDates[0].range.from);
				//console.log("traite les dates activé");
			let arrayBooked=[];
			let arrayDemande=[];
			let arrayRefuse = [];

			for(var arraDate of arrayDates){

				let froma=new Date(arraDate.range.from); 
				let toa=new Date(arraDate.range.to);

				if(arraDate.statut==="demande"){
					arrayDemande.push({from:froma,to:toa});
					}
				else if(arraDate.statut==="refuse"){
					arrayRefuse.push({from:froma,to:toa});
					}
				else{
					let fromu=new Date(Number(arraDate.range.from)); 
					let tou=new Date(Number(arraDate.range.to));
					arrayBooked.push({from:fromu,to:tou});
					}
				}


				let bookedFusion = fusionBooked(arrayBooked);

			    // ajout d'indexer à chaque array
				this.traiteForArrays(arrayDemande);
				//this.traiteForArrays(arrayBooked);
				this.traiteForArrays(bookedFusion);
				console.log("bookedFusion indexed "+JSON.stringify(bookedFusion));

			    // traite arrayDemande pour y checker les dates demandées plusieures fois par différentes personnes
				//var twicing=this.goTwice(arrayDemande);
				var betweeners=this.goBetween(arrayDemande);
				//console.log("between non reduced "+JSON.stringify(betweeners));

				//console.log("got twice twicing "+JSON.stringify(twicing));

				// création d'un objet Set qui ne prend que les valeurs uniques d'un array
				let reducBetweeners=this.reduceringer(betweeners);
					//console.log("gala "+JSON.stringify(reducBetweeners));
					//console.log("got betweeners "+JSON.stringify(betweeners));
					//console.log("traite les dates : arrayDemand = "+JSON.stringify(arrayDemande));
					//console.log("traite les dates : arrayBooked = "+JSON.stringify(arrayBooked));

			this.setState({dejaDemande:arrayDemande,booking:bookedFusion,betweener:reducBetweeners});
			}

	// place en state la copie de la DB réservations, dans une array traité ensuite pour séparer booked, demande, refus
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
				//.catch(err=>{ console.log('catch 1');});
			}


	/*** GESTION affichage des dates réservées, interdites ou en attentente ***/
   	componentWillMount() {
	    	this.getReservations();
  	}

	// désactive l'évènement au changement de component pour éviter les problèmes de mémoire
	componentWillUnmount() {
		this.props.firebase.reservations().off();
	};


/*** Gestion rendering du contenu du component ***/

  render() {
	
	const { from, to,dejaDemande,booking,betweener} = this.state;
        const modifiers = {
			   highlighted: new Date(),
			   sundays: { daysOfWeek: [0] },
			   start: from, 
			   end: to,
			   booked:booking,
			   onDemand:dejaDemande,
			   onBetween:betweener,
			  };

    return (
      <div className="datepicker col-12">
	<div className="row">
		{/*ajout de style pour personnaliser le calendrier et les jours*/}
		<style>{Styler}</style>
		
		{/*this.state.selectedDay ? (
		  <p>Vous avez sélectionné cette date : {this.state.selectedDay.toLocaleDateString("fr-FR",{year: "numeric", month: "long", day: "numeric"})}</p>
		) : (
		  <p>Veuillez sélectionner une date</p>
		)*/}

		<div className="col-8">
			<h2>Affichage des disponibilités <br /> et réservations actuelles</h2>
			{/* 
			   description des props:
				handleDayClick sélectionne la date et la place dans le state
				selectedDays change la couleur de la date sélectionnée selectedDays={this.state.selectedDay} modifié après
				disabledDays empeche le clic sur les jours définits, ici le dimanche "0"
				modifiers donne une class à un jour précis pour en changer la couleur
				locale fr pour définir un langage autre que english, avec localutils
				modifiersStyles ajoute des styles dans la balise en mode cochon
			*/} 
			<DayPicker 
				onDayClick={this.handleDayClick} 

				className="Selectable"

				selectedDays={[from, { from, to }]}

				disabledDays={{ before: today }}

				modifiers={modifiers}

				locale="fr" 

				localeUtils={localeUtils}

				modifiersStyles={modifiersStyles}

				numberOfMonths={2}
			/>
			<div className="row">
			<div className="legende col-6">
				<ul>
					<li><span className="boxing red"></span> Déjà réservé, et approuvé</li>
					<li><span className="boxing orange"></span> Demandé, pas approuvé</li>
				</ul>
			</div>
			<div className="legende col-6">
				<ul>
					<li><span className="boxing pink"></span> Plusieurs demandes pour le même jour</li>
					<li><span className="grey">texte en gris</span> dates impossibles</li>
				</ul>
			</div></div>
		</div>

		<div className="col-4">
				<h2>Demande de réservation du chalet :</h2>

				{/*<OrdersIndex/>*/}		
          		{!from && !to && (<p>Veuillez sélectionner le premier jour<br />en cliquant sur une date du calendrier</p>)}
          		{from && !to && (<p>Veuillez sélectionner le dernier jour sur ce calendrier</p>)}
			{from && to &&(<h3>Dates sélectionnée</h3>)}
			{from && to &&
			    ` du ${from.toLocaleDateString("fr-FR",{year: "numeric", month: "long", day: "numeric"})} au ${to.toLocaleDateString("fr-FR",{year: "numeric", month: "long", day: "numeric"})}`}{' '}
			{from && to && (
			      <div className="goBook">
				{/*<FormDay fromProps={this.state.from.getTime()}  toProps={this.state.to.getTime()} />*/}
				<button className="link btn btn-info" onClick={this.onSubmit}>Réserver</button><br /><br />
				<p>La demande sera envoyée à l'administrateur avant confirmation</p>
				<button className="link btn btn-danger" onClick={this.handleResetClick}>Annuler ces dates
					</button>
			      </div>
			    		)}
			{!from && !to && this.state.demandeFaite &&(<p>Une demande de réservation a été envoyée</p>)}

        	</div>
        </div>
      </div>
    );
  }
}


// condition identique à const condition = authUser => authUser != null;
// authUser doit être différent de null ou plutot doit etre egal a true
const condition = authUser => !!authUser;

// export du compenent en fonction de la condition d'authification

export default withAuthorization(condition)(DatePicker);
