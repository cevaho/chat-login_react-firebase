import React, {Component} from 'react';

import DayPicker from 'react-day-picker';
//import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';


//Gestion du format des dates et langage du formulaire
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

  // style css contenu dans une variable et ajoutée dans le jsx par appel de cette variable
  const Styler='.DayPicker-Day--highlighted{background-color:orange;color:white;}.Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {background-color: #f0f8ff !important;color: #4a90e2;}.Selectable .DayPicker-Day {border-radius: 0 !important;}.Selectable .DayPicker-Day--start {border-top-left-radius: 50% !important;border-bottom-left-radius: 50% !important;}.Selectable .DayPicker-Day--end {border-top-right-radius: 50% !important;border-bottom-right-radius: 50% !important;}';


  // pour ajouter des styles en dehors de la balise style, dans la balise
  const modifiersStyles = {
    birthday: {
      color: 'white',
      backgroundColor: '#ffc107',
    },
    thursdays: {
      color: '#ffc107',
      backgroundColor: '#fffdee',
    },
    booked:{
	backgroundColor:'red',borderRadius: 0,
    },
  };

  // date du jour pour comparaison et désactiver les jours d'avant
  const today = new Date();

class justTable extends Component {

  render() {
        const modifiers = {
			   highlighted: new Date(),
			   thursdays: { daysOfWeek: [0] },
			   booked:[
				   {from: new Date(2019, 6, 12),to: new Date(2019, 6, 16)},
				   {from: new Date(2019, 7, 12),to: new Date(2019, 7, 16)},
				  ],
			  };

    return (
      <div className="datepicker col-12">
	<div className="col-12">
		{/*ajout de style pour personnaliser le calendrier et les jours*/}
		<style>{Styler}</style>

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
			className="Selectable"

			disabledDays={{ before: today }}

			modifiers={modifiers}

			locale="fr" 

			localeUtils={localeUtils}

			modifiersStyles={modifiersStyles}

			numberOfMonths={2}
		/>
        </div>
      </div>
    );
  }
}

export default justTable;
