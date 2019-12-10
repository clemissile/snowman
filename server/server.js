const { Connection, query } = require('stardog');
var express = require('express');
var app = express();

const conn = new Connection({
	username: 'admin',
	password: 'admin',
	endpoint: 'http://localhost:5820',
});

function makeStardogQuery(queryText, callback) {
	query.execute(conn, 'snowman', queryText,
			'application/sparql-results+json', {
		offset: 0,
		reasoning: true		
	}).then(({ body }) => {
		callback(body);
	}).catch((error) => {
		console.log(error)
	});
}

/* Allow Cross-Orign Access */
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/* Reset du jeu */
app.get('/reset', function(req, res) {
	let stQ = "DELETE { ?player :locatedAt ?cellPlayer . }" +
	"INSERT { ?player :locatedAt :cell"+(Math.floor(Math.random() * 9) + 1)+""+(Math.floor(Math.random() * 9) + 1)+" . }" +
	"WHERE  {" +
	"	?player rdf:type :Player ." +
	"	?cellPlayer rdf:type :CellPlayer" +
	"};" +
	
	"DELETE { ?snowLittle :locatedAt ?cellLittle . }" +
	"INSERT { ?snowLittle :locatedAt :cell"+(Math.floor(Math.random() * 8) + 1)+""+(Math.floor(Math.random() * 8) + 1)+" . }" +
	"WHERE  {" +
	"	?snowLittle rdf:type :Little ." +
	"	?cellLittle rdf:type :CellLittle" +
	"};" +
	
	"DELETE { ?snowMedium :locatedAt ?cellMedium . }" +
	"INSERT { ?snowMedium :locatedAt :cell"+(Math.floor(Math.random() * 8) + 1)+""+(Math.floor(Math.random() * 8) + 1)+" . }" +
	"WHERE  {" +
	"	?snowMedium rdf:type :Medium ." +
	"	?cellMedium rdf:type :CellMedium" +
	"};" +
	
	"DELETE { ?snowBig :locatedAt ?cellBig . }" +
	"INSERT { ?snowBig :locatedAt :cell"+(Math.floor(Math.random() * 8) + 1)+""+(Math.floor(Math.random() * 8) + 1)+" . }" +
	"WHERE  {" +
	"	?snowBig rdf:type :Big ." +
	"	?cellBig rdf:type :CellBig" +
	"}";

	makeStardogQuery(stQ, function(data) {
		res.redirect("http://localhost:8081/afficheJeu");
	});
});

/* Gestion du mouvement */
app.get('/move', function(req, res) {
	// On récupère la direction demandée
	let direction = req.query.d;

	// On teste si le déplacement est possible
	makeStardogQuery('ASK WHERE {?cell rdf:type :CellFree' + direction + 'Player}', function(data) {
		if (data.boolean) {
			// On teste si une boule de neige est sur le chemin
			makeStardogQuery('SELECT ?snow ' +
							 'WHERE {' +
								'?cellPlayer rdf:type :CellPlayer .' +
								'?cellPlayer :has'+ direction +' ?cellMove .' +
								'?cellMove rdf:type ?snow .' +
								'FILTER(?snow IN(:CellLittle, :CellMedium, :CellBig, :CellLittleMedium, :CellMediumBig, :Snowman))' +
							'}', function(data) {
								if (data.results.bindings.length == 1) {
									let typeSnow = data.results.bindings[0].snow.value.replace('http://www.semanticweb.org/21402554/ontologies/2019/9/ganivet-snowman#', '');
									console.log(typeSnow, "|", direction);

									makeStardogQuery('ASK WHERE { ?snow rdf:type :CellLittle . ?snow :hasNorth ?cellMove . ?cellMove rdf:type :CellFree .}', function(data) {
										if (data.boolean) {
											//On teste si la cellule N+1 est de type snow
											makeStardogQuery('SELECT ?snow ' +
											'WHERE {' +
												'?cellN1 rdf:type :'+ typeSnow +' .' +
												'?cellN1 :has'+ direction +' ?cellMove .' +
												'?cellMove rdf:type ?snow .' +
												'FILTER(?snow IN(:CellLittle, :CellMedium, :CellBig, :CellLittleMedium, :CellMediumBig, :Snowman))' +
											'}', function(data) {
												if (data.results.bindings.length > 0) {
													let typeSnowN1 = data.results.bindings[0].snow.value.replace('http://www.semanticweb.org/21402554/ontologies/2019/9/ganivet-snowman#', '');

													if ((typeSnow == "CellLittle" && typeSnowN1 == "CellMedium") || (typeSnow == "CellMedium" && typeSnowN1 == "CellBig")) {
														// Si on est dans un de ces cas, l'empillage peut se faire
														let stQ = "DELETE { ?player :locatedAt ?cellPlayer ." +
														"			?snow :locatedAt ?cellSnow .}" +
														"INSERT { ?player :locatedAt ?newCell ." +
														"			?snow :locatedAt ?newCellS .}" +
														"WHERE {" +
															"?player rdf:type :Player ." +
															"?snow rdf:type :"+typeSnow.replace("Cell", "")+" ." +
															"?cellPlayer rdf:type :CellPlayer ." +
															"?cellSnow rdf:type :"+ typeSnow +" ." +
															"?cellPlayer :has"+ direction +" ?newCell ." +
															"?cellSnow :has"+ direction +" ?newCellS ." +
														"}";
														makeStardogQuery(stQ, function(data) {
															res.redirect("http://localhost:8081/afficheJeu");
														});
													} else {
														if (data.results.bindings.length > 1) {
															// Si le resultat contient plus de 2 c'est qu'on veut
															// empiler sur LittleMedium ou MediumBig
															let stQ = "DELETE { ?player :locatedAt ?cellPlayer ." +
															"			?snow :locatedAt ?cellSnow .}" +
															"INSERT { ?player :locatedAt ?newCell ." +
															"			?snow :locatedAt ?newCellS .}" +
															"WHERE {" +
																"?player rdf:type :Player ." +
																"?snow rdf:type :"+typeSnow.replace("Cell", "")+" ." +
																"?cellPlayer rdf:type :CellPlayer ." +
																"?cellSnow rdf:type :"+ typeSnow +" ." +
																"?cellPlayer :has"+ direction +" ?newCell ." +
																"?cellSnow :has"+ direction +" ?newCellS ." +
															"}";
															makeStardogQuery(stQ, function(data) {
																res.redirect("http://localhost:8081/afficheJeu");
															});
														} else {
															// Sinon on ne fait rien
															res.redirect("http://localhost:8081/afficheJeu");
														}
													}
												} else {
													//Si N+1 est vide, on déplace le joueur et la boule concernée
													let stQ = "DELETE { ?player :locatedAt ?cellPlayer ." +
													"			?snow :locatedAt ?cellSnow .}" +
													"INSERT { ?player :locatedAt ?newCell ." +
													"			?snow :locatedAt ?newCellS .}" +
													"WHERE {" +
														"?player rdf:type :Player ." +
														"?snow rdf:type :"+typeSnow.replace("Cell", "")+" ." +
														"?cellPlayer rdf:type :CellPlayer ." +
														"?cellSnow rdf:type :"+ typeSnow +" ." +
														"?cellPlayer :has"+ direction +" ?newCell ." +
														"?cellSnow :has"+ direction +" ?newCellS ." +
													"}";
													makeStardogQuery(stQ, function(data) {
														res.redirect("http://localhost:8081/afficheJeu");
													});
												}
											});
										} else {
											res.redirect("http://localhost:8081/afficheJeu");
										}
									});
								} else if (data.results.bindings.length > 1) {
									//LittleMedium, MediumBig ou Snowman donc pas de move possible
									res.redirect("http://localhost:8081/afficheJeu");
								} else {
									console.log(direction, "| Mvt Joueur OK");

									// Si ce n'est pas le cas, on déplace le joueur uniquement
									let stQ = "DELETE { ?player :locatedAt ?cellPlayer . }" +
									"INSERT { ?player :locatedAt ?newCell . }" +
									"WHERE  {" +
									"		?player rdf:type :Player ." +
									"		?cellPlayer rdf:type :CellPlayer ." +
									"		?cellPlayer :has" + direction + " ?newCell ." +
									"}";
									makeStardogQuery(stQ, function(data) {
										res.redirect("http://localhost:8081/afficheJeu");
									});
								}
			});
		} else {
			console.log(direction, "| Mvt impossible");
			res.redirect("http://localhost:8081/afficheJeu");
		}
	});
});

/* Affichage du plateau, joueur et boules de neige */
app.get('/afficheJeu', function (req, res) {
	let size = 10;
	let array = new Array(size);
	for(let i = 0; i < size ; i++) {
		array[i] = new Array(size).fill("");
	}

	let p = "";
	makeStardogQuery('select ?cell where { ?player rdf:type :Player . ?player :locatedAt ?cell }', function(data) {
		p = data.results.bindings;
		let pos = p[0].cell.value.replace('http://www.semanticweb.org/21402554/ontologies/2019/9/ganivet-snowman#cell', '');
		array[pos[0]][pos[1]] = "P";

		let balls = "";
		makeStardogQuery("SELECT ?cellL ?cellM ?cellB WHERE { ?cellL rdf:type :CellLittle . ?cellM rdf:type :CellMedium . ?cellB rdf:type :CellBig }", function(data) {
			balls = data.results.bindings;

			let bL = balls[0].cellL.value.replace('http://www.semanticweb.org/21402554/ontologies/2019/9/ganivet-snowman#cell', '');
			let bM = balls[0].cellM.value.replace('http://www.semanticweb.org/21402554/ontologies/2019/9/ganivet-snowman#cell', '');
			let bB = balls[0].cellB.value.replace('http://www.semanticweb.org/21402554/ontologies/2019/9/ganivet-snowman#cell', '');

			if (bL == bM && bM != bB) {
				array[bL[0]][bL[1]] = "LM";
				array[bB[0]][bB[1]] = "B";
			} else if (bM == bB && bB != bL) {
				array[bL[0]][bL[1]] = "L";
				array[bB[0]][bB[1]] = "MB";
			} else if (bL == bM && bM == bB) {
				array[bL[0]][bL[1]] = "LMB";
			} else {
				array[bL[0]][bL[1]] = "L";
				array[bM[0]][bM[1]] = "M";
				array[bB[0]][bB[1]] = "B";
			}

			res.send(array);
		});
	});
});

app.listen(8081, function () {
  console.log('API listening on port 8081!')
});
