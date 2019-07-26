import React, {Component} from 'react';


class FormDay extends Component {

  constructor(props, context) {
    super(props);

    console.log("mes props = ");
		console.log(this.props);
		
    this.state = { 
	      rangeDate:{},
	      dater: new Date().toLocaleDateString("fr-FR", 
			{weekday: "long", year: "numeric", month: "long",day: "numeric",hour:"numeric",minute:"numeric"}),
	    };
  }


  /*componentWillMount() {
	    // modifie le state rangeDate pour lui donner une valeur des dates déjà réservées en props
	    let ranger={from": this.props.fromProps,"to": this.props.toProps};

			console.log("props.fromProps "+this.props.fromProps);

			this.setState({rangeDate:ranger});
			console.log("state rangeDate "+JSON.stringify(this.state.rangeDate));
  }*/

  //fonction qui envoie les infos du form dans la DB firebase
  addReservationToDB=(rangeDate,dater)=>{
				this.props.firebase.reservations()
				.push({username:this.props.firebase.auth.currentUser.displayName,statut:"demande",
					range:rangeDate,dateEnvoi:dater})
			     };

  // evenement onsubmit du formulaire pour envoi des données vers la db
  onSubmit = (event)=>{
		      console.log("tentative d'envoi de réservation");
			let ranga=this.state.rangeDate;


			// modifie le state rangeDate pour lui donner une valeur des dates déjà réservées en props
	    		let ranger={"from": this.props.fromProps,"to": this.props.toProps};

			console.log("ranger = "+JSON.stringify(ranger));
			console.log("props.fromProps "+new Date(this.props.fromProps));
			console.log("props.toProps "+new Date(this.props.toProps));

			this.setState({rangeDate: ranger}, function () {
    				console.log("state rangeDate "+JSON.stringify(this.state.rangeDate));
			});

			//this.setState({rangeDate:ranger});
			//console.log("state rangeDate "+JSON.stringify(this.state.rangeDate));


			//let str = JSON.stringify(ranga);console.log(str);

			console.log(ranga.from);
			/*if(this.state.range.to!==""){
					this.addReservationToDB(this.state.rangeDate,this.state.dater);
					console.log("range date : "+this.state.rangeDate);
					console.log("date actuelle : "+this.state.dater);					
			}*/

				// empêche le rechargement de la page
			event.preventDefault();
		      };

  render() {
    return (
      <div className="formday">

	<form action="/" onSubmit={this.onSubmit} id="formulaire_range" className="review-form">
		<div className="input-group">
			<div className="input-group-append">
            		    <button className="btn lead btn-info"type="submit" id="envoi_message" value="Envoyer">
				Réserver</button>
			</div>
		</div>
        </form>
      </div>
    );
  }
}



export default FormDay;
