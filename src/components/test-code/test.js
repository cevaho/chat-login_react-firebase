import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class OrdersIndex extends React.Component {

    constructor(props) {
        super(props);

        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);

        this.state = {
            loading: false,
            from: undefined,
            to: undefined,
            count: null,
            orders: null
        };
    }

    //désactive le timeout qui pourrait tourner après la désactivation du component
    componentWillUnmount() {
       clearTimeout(this.timeout);
    }

    focusTo() {
	// lancé une première fois après la sélection de la première date, pas la seconde
	// pour garder le focus sur l'input 2 lors d'un nouveau clic, dans un temps 0 après avoir sélectionné la première date
	console.log("focus lancé pour changement d'input après sélection de commencement");
        this.timeout = setTimeout(
					() => {
						console.log("focus vers l'instance de l'autre input");
					        this.to.getInput().focus();
					      },0
				  );
    }

/*
    // activé quand la deuxième date est sélectionnée son changement d'état
    showFromMonth() {

	// définit les noms dans ce scope comme étant les states se rapportant à ce nom
        const { from, to } = this.state;

	// state.from inexistant met fin à la fonction
        if (!from) return;

	// si les deux dates sont différentes et que cela se passe dans les deux mois présentés
	// utilisait moment qui ne fonctionne pas avec cette version de bootstrap
        // if (moment(to).diff(moment(from), 'months') < 2) {	
	if (this.state.to !== this.state.from){

	    // renvoie l'instance de daypicker (voir daypicker API) 
	    // si la sélection se passe dans un autre mois que les deux autres mois présentés
	    // active à nouveau la fonction pour changer la deuxième date
            this.to.getDayPicker().showMonth(from);
        }
    }
*/

    // actif des que l'on clique sur une date après avoir cliqué dans l'input "commence.."
    handleFromChange(from) {
	// change le state de from
        this.setState({ from }, () => {


		console.log("from value state, date de début"+from);

		// contient une valeur dès qu'il y a une modification dans l'input sinon undefined
		console.log("date de fin non définie "+this.state.to)
		
	    // si state.to undefined donc différent de true passe le focus au second input
	    // ne se produit pas quand on a déjà fait un choix de date de fin
            if (!this.state.to) {console.log("go vers input date de fin");
                this.focusTo();
            }
        });
    }

    // change l'état de date de fin
    // active la fonction showFromMonth dans un state si on en avait l'envie
    handleToChange(to) {
        /*this.setState({ to }, () => {
            this.showFromMonth();
        });*/
	this.setState({ to });
    }

    //si une requete à lieu vers les serveurs et que l'on attend une réponse
    fetch(params = {}) {
        this.setState({
            loading: true
        });

        // fetch data from backend, using params for filtering
    }

    // fonction activée quand on attend une réponse du serveur
    renderChart(orders) {
        // render chart
    }

    render() {
        const { loading, count, orders, from, to } = this.state;
        const modifiers = { start: from, end: to };


        return (
            <div className="datepicker col-12">
	      <div className="col-12">
                <DayPickerInput
                    value={from}
                    placeholder={'commence le ..'}
                    format="LL"
                    dayPickerProps={{
                        selectedDays: [from, { from, to }],
                        disabledDays: { after: to },
                        toMonth: to,
                        modifiers,
                        numberOfMonths: 1,
                    }}
                    onDayChange={this.handleFromChange}
                />{' '}
                —{' '}
                <DayPickerInput
                    ref={el => (this.to = el)}
                    value={to}
                    placeholder={'finit le ..'}
                    format="LL"
                    dayPickerProps={{
                      selectedDays: [from, { from, to }],
                      disabledDays: { before: from },
                      modifiers,
                      month: from,
                      fromMonth: from,
                      numberOfMonths: 1,
                    }}
                    onDayChange={this.handleToChange}
                />
                {loading
                    ? <div>loading</div>
                    : <div>
                        <h3><i className="fa fa-shopping-cart"></i> {count}</h3>
                        {this.renderChart(orders)}
                    </div>
                }
            </div></div>
        );
    }
}
export default OrdersIndex;
