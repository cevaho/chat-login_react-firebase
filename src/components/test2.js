import React, {Component} from 'react';
import { withAuthorization } from './session/Session-index';
import DayPicker, { DateUtils } from 'react-day-picker';
//import FormDay from './FormDay';
//import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';


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
  const Styler='.DayPicker-Day--highlighted{background-color:orange;color:white;}.Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {background-color: #f0f8ff !important;color: #4a90e2;}.Selectable .DayPicker-Day {border-radius: 0 !important;}.Selectable .DayPicker-Day--start{border-top-left-radius: 50% !important;border-bottom-left-radius: 50% !important;}.Selectable .DayPicker-Day--sundays{backgroundColor:#fffdee;}.Selectable .DayPicker-Day--start.DayPicker-Day--sundays {border-top-left-radius: 50% !important;border-bottom-left-radius: 50% !important;background-color:#51A0FA;}.Selectable .DayPicker-Day--end {border-top-right-radius: 50% !important;border-bottom-right-radius: 50% !important;}';

		/*
		  // modification du style du jour par une fonction appelée dans le jsx qui va ajouter une class à ce jour
		  const modifiers = {
		  	//highlighted: this.state.selectedDay,
			//birthday: new Date(2019, 6, 30),
			highlighted: new Date(),
			sundays: { daysOfWeek: [0] },
			booked:{from: new Date(2019, 6, 12),to: new Date(2019, 6, 16) }
		  };
		*/

	  // pour ajouter des styles en dehors de la balise style, dans la balise
	  const modifiersStyles = {
	    birthday: {
	      color: 'white',
	      backgroundColor: '#ffc107',
	    },
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
    this.state.booking=undefined;
    this.state.dater= new Date().getTime();
    this.state.demandeFaite=false;
    this.state.reservations=undefined;
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
				console.log(this.props.firebase.auth.currentUser.displayName+" "+ranger.from+" "+ranger.to+" "+dater)
				this.props.firebase.reservations()
				.push({username:this.props.firebase.auth.currentUser.displayName,statut:"demande",
					range:ranger,dateEnvoi:dater});

				this.setState({demandeFaite:true});
				//this.getInitialState();
				this.setState({from:undefined,to:undefined});
				console.log("state apres initialisation"+this.state.to);
				
			     };

  // onsubmit du button pour envoi des réservations vers la db
  onSubmit = ()=>{
		if(this.state.from!==undefined && this.state.to!==undefined){
					/*console.log("tentative d'envoi de réservation");
					console.log("this.state.from "+new Date(this.state.from).getTime());
					console.log("this.state.to "+new Date(this.state.to).getTime());*/

					// création de l'objet à placer dans la clé range pour le json de la DB
	    				let ranger={"from": new Date(this.state.from).getTime(),
						    "to": new Date(this.state.to).getTime()};
					//console.log("ranger = "+JSON.stringify(ranger));
					//console.log(this.state.dater);
					this.addReservationToDB(ranger,this.state.dater);
		}
  };


/*** GESTION selection de date au clic ***/

		/*
		  // pour la sélection de date unique
		  handleDayClick(day, { selected, disabled }) {

		    // désélectionne la date si elle était déjà cliquée
		    if (selected) {
		      this.setState({ selectedDay: undefined });
		      return;
		    }

		    // selon le props disabled qui contient les jours que l'on ne peut pad sélectionné, 
		    // on empeche la sélection sur un de ses jours, pour l'exemple, le dimanche jour 0
		    // **** comment désactiver des range de date ?
		    if (disabled) {
		      return;
		    }

		    this.setState({ selectedDay: day });
		  }

			https://stackoverflow.com/questions/17304426/javascript-date-range-between-date-range
			http://react-day-picker.js.org/docs/matching-days/
		*/

		  // pour la sélection de dates multiples (range)
		  // booked et  disabled renvoient une boléenne
		  // handleDayClick(day,{disabled,booked}) {

  handleDayClick(day,modifiers) {

	//permet la sélection de date multiples
    	const range = DateUtils.addDayToRange(day, this.state);

    		//console.log(booked); = true
    		//console.log(modifiers.booked); = true
		//console.log("from = "+this.state.from);console.log("to = "+this.state.to); = undefined à cet instant
		//console.log("range.from "+range.from);console.log("range.to "+range.to);

	// comparaison des dates, si le range comprend des dates déjà réservées, 
	// si date de début < que date debut résevée la sélection s'arrete à la date précédant la date réservée
		let rangFromer=range.from;let rangToer=range.to;
		let book=this.state.booking;

		//fonction hors du loop mais utilisée dans le loop pour contenir la valeur des propriétés de l'objet book
		let findFrom = (index) =>{
				return book.find(x => x.indexer === index).from
				}

		let findTo = (index) =>{return book.find(x => x.indexer === index).to}

		
		//for(let key=1;key<=book.length;key++){
		// for each in array en es6 :
		for(var [index] of book.entries()){
			
			let fromer= findFrom(index);let toer= findTo(index);
			//console.log("fromer = "+ fromer);console.log("toer = "+ toer);
			//console.log(" value.indexer: "+index+" value from: "+value.from+" value to: "+value.from);

			if(rangFromer <= fromer && rangToer >= toer){
				//console.log("date definie entourant date interdite");
				//console.log("fromer "+fromer);
				let beforeFromer = new Date(fromer-= 24*3600*1000);
				//console.log("secondes formatées en date = "+beforeFromer);
				//return;
				range.to=beforeFromer;
				this.setState(range);
				return;
								    }
			
			
		}

    // si modifier disabled ou modifier booked, empeche la sélection placée dans le state
    if (modifiers.disabled || modifiers.booked) {
      return;
    }
    this.setState(range);
  }

  // suppression de la date sélectionnée par ré-initialisation du state
  handleResetClick() {
    this.setState(this.getInitialState());
  }



/*** gestion de réception des réservation dans la DB ***/

	traiteLesDates=(arrayDates)=>{
			//console.log(" arraydate = "+JSON.stringify(arrayDates));
			console.log(arrayDates[0].range.from);
			let arrayBooked=[];
			let arrayDemande=[];

			// place les dates dans différents tableaux booked ou demande
			for(var arraDate of arrayDates){
				if(arraDate.statut==="demande"){
					arrayDemande.push(arraDate.range);
					}
				else{arrayBooked.push(arraDate.range);}
				}

			// ajout d'index'er' lié au nombre de case et pas l'id de chaque range 
			// au cas ou on supprime des ranges plus tard
	    		// en clé valeur pour être comparé par la suite dans un loop des nouvelles dates choisies
			/*for (var[index,value] of arrayBooked.entries()){
				// création de la clé indexer dans chaque objet et de sa valeur = à index
				value.indexer = index;
				//console.log(value);console.log(value.indexer);
	    		};
			for (var[index,value] of arrayDemande.entries()){
				// création de la clé indexer dans chaque objet et de sa valeur = à index
				value.indexer = index;
				//console.log(value);console.log(value.indexer);
	    		};*/

			console.log(" arrayDemande = "+JSON.stringify(arrayDemande));
			console.log(" arrayBooked = "+JSON.stringify(arrayBooked));
			this.setState({booking:arrayBooked,dejaDemande:arrayDemande});
			}

	getReservations=()=>{

			// Réception d'une copie de la DB, création d'un array contenant un array par réservation, placé en state
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
							this.setState({reservations:reservationList});
							}
							this.traiteLesDates(this.state.reservations);
    							});
			}


	/*** GESTION affichage des dates réservées, interdites ou en attentente ***/
   	componentWillMount() {
		
	    this.getReservations();console.log("reservations :");
		//console.log(this.state.reservations);
/*
	    // modifie le state booking pour lui donner une valeur des dates déjà réservées
	    let bookinger=[
			  {from: new Date(2019, 2, 23),to: new Date(2019, 3, 26)},
			  {from: new Date(2019, 7, 12),to: new Date(2019, 8, 16)},
			  ];

	    // ajout d'index'er' lié au nombre de case et pas l'id de chaque range au cas ou on supprime des ranges plus tard
	    // en clé valeur pour être comparé par la suite dans un loop des nouvelles dates choisies

	    for (var[index,value] of bookinger.entries()){
		// création de la clé indexer dans chaque objet et de sa valeur = à index
		value.indexer = index;
		//console.log(value);console.log(value.indexer);
	    };

    	    this.setState({booking:bookinger});*/
  	}

	/*/ activation de la réception lorsque le component a été créé
	componentDidMount(){
		this.getReservations();console.log("reservations :");
		console.log(this.state.reservations);
	};*/

	// désactive l'évènement au changement de component pour éviter les problèmes de mémoire
	componentWillUnmount() {
		this.props.firebase.reservations().off();
	};


/*** Gestion rendering du contenu du component ***/

  render() {
	
	const { from, to, booking } = this.state;
        const modifiers = {
			   highlighted: new Date(),
			   sundays: { daysOfWeek: [0] },
			   booked: booking,
			   start: from, 
			   end: to,
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
		<h2>Affichage des disponibilités et réservations actuelles</h2>
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

			numberOfMonths={4}
		/>
		</div>

		<div className="col-4">
				<h2>Demande de réservation du chalet :</h2>

				{/*<OrdersIndex/>*/}		
          		{!from && !to && (<p>Veuillez sélectionner le premier jour<br />en cliquant sur une date du calendrier</p>)}
          		{from && !to && (<p>Veuillez sélectionner le dernier jour sur ce calendrier</p>)}
			{from && to &&
			    `Dates sélectionnée du ${from.toLocaleDateString("fr-FR",{year: "numeric", month: "long", day: "numeric"})} au ${to.toLocaleDateString("fr-FR",{year: "numeric", month: "long", day: "numeric"})}`}{' '}
			{from && to && (
			      <div>
				{/*<FormDay fromProps={this.state.from.getTime()}  toProps={this.state.to.getTime()} />*/}
				<button className="link btn btn-info" onClick={this.onSubmit}>Réserver</button>
				<p>La demande sera envoyée à l'administrateur avant confirmation</p>
				<button className="link btn btn-info" onClick={this.handleResetClick}>Annuler ces dates
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
