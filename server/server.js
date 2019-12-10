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
							 'FILTER(?snow IN(:Little, :Medium, :Big, :LittleMedium, :MediumBig, :Snowman))' +
							'}', function(data) {
								if (data.results.bindings.length > 0) {
									let typeSnow = data.results.bindings[0].snow.value.replace('http://www.semanticweb.org/21402554/ontologies/2019/9/ganivet-snowman#', '');;
									console.log(typeSnow, "|", direction);

									let stQ = "DELETE { ?player :locatedAt ?cellPlayer ." +
											  "			?snow :locatedAt ?cellSnow .}" +
							   				  "INSERT { ?player :locatedAt ?newCell ." +
											  "			?snow :locatedAt ?newCellS .}" +
											  "WHERE {" +
													"?player rdf:type :Player ." +
													"?snow rdf:type :Snow ." +
													"?cellPlayer rdf:type :CellPlayer ." +
													"?cellSnow rdf:type :"+ typeSnow +" ." +
													"?cellPlayer :has"+ direction +" ?newCell ." +
													"?cellSnow :has"+ direction +" ?newCellS ." +
											  "}";
									makeStardogQuery(stQ, function(data) {
										res.redirect("http://localhost:8081/afficheJeu");
									});
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
		makeStardogQuery('SELECT ?cell WHERE { ?snow rdf:type :Snow . ?snow :locatedAt ?cell }', function(data) {
			balls = data.results.bindings;

			let bL = balls[1].cell.value.replace('http://www.semanticweb.org/21402554/ontologies/2019/9/ganivet-snowman#cell', '');
			let bM = balls[2].cell.value.replace('http://www.semanticweb.org/21402554/ontologies/2019/9/ganivet-snowman#cell', '');
			let bB = balls[0].cell.value.replace('http://www.semanticweb.org/21402554/ontologies/2019/9/ganivet-snowman#cell', '');

			array[bL[0]][bL[1]] = "L";
			array[bM[0]][bM[1]] = "M";
			array[bB[0]][bB[1]] = "B";

			res.send(array);
		});
	});
});

app.listen(8081, function () {
  console.log('API listening on port 8081!')
});
