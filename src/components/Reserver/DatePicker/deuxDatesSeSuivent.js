
// fonction qui permet de fusionner toutes les dates réservées qui se suivent sans jour libre entre elles

let fusionBooked = (A) => {
			// console.log("A not sorted"+JSON.stringify(A));

/*let A=[
	{"from":4,"to":5},
	{"from":0,"to":2},
	{"from":6,"to":9},
	{"from":12,"to":15},
	{"from":16,"to":17},
	{"from":18,"to":19},
	{"from":22,"to":23},
	{"from":20,"to":21},
	];*/

// fonction de comparaison associée à .sort() pour trier les dates par ordre croissant afin de bien les traiter par la suite
let compare = ( a, b ) => {
 // si resultat négatif a est avant b
  if ( a.from < b.from ){
    return -1;
  }
  // si resultat positif a est après b
  if ( a.from > b.from ){
    return 1;
  }
  return 0;
}

A.sort(compare);
	//console.log("A sorted"+JSON.stringify(A)); //ok avec format date



let B=[];


for(let line of A){

	let bsize=B.length;

	if(bsize<=0){
			//console.log("--------------egal 0");
			//console.log(Number(line.from))
			let objet={"from":line.from,"to":line.to};
			B[0]=objet;
			B.push(objet);
				//console.log(" B[0] "+JSON.stringify(B[0]));
			}

	if(bsize===1){
			//console.log("--------------egal 1");
				if(
					//B[0].from jourAprès line.to
					B[0].from.getTime() - line.to.getTime() === 86400000
					){
									let objet={"from":line.from,"to":B[0].to};
									B[0]=objet;
									B.push(objet);
									//console.log(" B[0] "+JSON.stringify(B[0])+
										//"bapresline B[1] "+JSON.stringify(B[1]));
				}

				else if(
					//B[0].to jourAvant line.from
					line.from.getTime() - B[0].to.getTime() ===1
					){
									let objet={"from":B[0].from,"to":line.to};
									B[0]=objet;
									B.push(objet);
									//console.log("bavantline B[0] "+JSON.stringify(B[0])+
										//" B[1] "+JSON.stringify(B[1]));
				}
				
				else {
					let objet={"from":line.from,"to":line.to};
					B.push(objet);
					//console.log("autre B[0] "+JSON.stringify(B[0])+
										//" B[1] "+JSON.stringify(B[1]));
				}
				console.log("=1, B "+JSON.stringify(B));
			}
	// resultat : [{"from":4,"to":5},{"from":4,"to":5}]

	if(bsize>1){
				//console.log("--------------plus grand que 1");
				//console.log("line "+JSON.stringify(line));

					/*console.log("B[bsize-1].from "+B[bsize-1].from);
						// console.log("B[bsize].from "+B[bsize].from); = undefined
					console.log("B[bsize-1].to "+B[bsize-1].to);
						// console.log("B[bsize].to "+B[bsize].to); = undefined

					console.log("line.from "+line.from);
					console.log("line.to "+line.to);
					*/

			// si bloc-de-dates line juste avant B[0]
				if(
					// signifie que B[0].from jourAprès line.to, donc :
					B[0].from.getTime() - line.to.getTime() === 86400000
					){
						console.log("avant - B[0] "+JSON.stringify(B[0])+
						" B[bsize-1] "+JSON.stringify(B[bsize-1]));

									let objet={from:line.from,to:B[0].to};
									B[0]=objet;
									console.log("objet "+JSON.stringify(objet));
									
									if(B[bsize-1].from != objet.from){
										B[bsize]=objet;
										}
									else{
										B[bsize-1]=objet;}	
				}

			// ou si bloc-de-dates line juste après B[0]
				else if(
					// signifie que B[0].to jourAvant line.from, donc :
					line.from.getTime() - B[0].to.getTime() === 86400000
					){
						console.log("bavantline - B[0] "+JSON.stringify(B[0])+
						" B[bsize-1] "+JSON.stringify(B[bsize-1]));

									let objet={"from":B[0].from,"to":line.to};
									B[0]=objet;
									console.log("objet "+JSON.stringify(objet));
									if(B[bsize-1].from != objet.from){
										B[bsize]=objet;
										}
									else{
										B[bsize-1]=objet;}
				}
				
				else {
					//B[0]=line;
					let objet={"from":line.from,"to":line.to};
					B[0]=objet;
					B.push(objet);

					console.log("- B[0] "+JSON.stringify(B[0])+
						"B[bsize] "+JSON.stringify(B[bsize-1]));
				}
				console.log(" B "+JSON.stringify(B));
			
			}
}
 console.log("A "+JSON.stringify(A));
// console.log("B "+JSON.stringify(B));

// suppression de premiere case et valeur de B
	B[0]="";
	B.splice(0, 1);
	console.log("B sans premiere case/valeur "+JSON.stringify(B));

return B;
};


export default fusionBooked;
