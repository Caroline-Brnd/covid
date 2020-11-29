import {generatePdf} from "../src/js/pdf-util.js"

window.addEventListener("load", async () => {

	const print = what => document.body.innerHTML += what + "<br/>";
	const die = how => print("<font color=\"red\">" + how + "</font>");

	try {

		print("covid rapide<br/>initialisation du cluster");

		let params = new URLSearchParams(location.search);

		if(params.has("no")) {
			params.delete("no");
			history.replaceState(null, null, "?" + params.toString());
			return die("ajouter cette page à l'écran d'accueil");
		}

		let infos = Array.from(params).reduce((o, i) => ({ ...o, [i[0]]: i[1] }), {});
		if(Object.keys(infos).length < 9) return die("info manquantes");
		
		print("édition de l'attestation");

		let iOs = /iP(hone|od|ad)/.test(navigator.platform) && (navigator.appVersion).match(/OS (\d+)_(\d+)/), iOsVersion = iOs && parseFloat(iOs.slice(1).join(".")) || 0;

		let date = moment().subtract(infos.minutes || 10, "minutes"), 
			pdf = await generatePdf({...infos, datesortie: date.format("DD[/]MM[/]YYYY"), heuresortie: date.format("HH[:]mm")}, infos.motif || "achats", "src/certificate.pdf", date).catch(err => die(err)), 
			blob = new Blob([pdf], {type: iOs && iOsVersion < 13 ? "application/pdf" : "application/octet-stream"});

		print("enregistrement");

		saveAs(blob, "attestation-" + date.format("YYYY[-]MM[-]DD[_]HH[-]mm") + ".pdf");

		print("ok");

	}
	catch(err) {
		die(err);
	}
	
});