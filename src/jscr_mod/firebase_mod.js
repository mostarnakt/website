// For DEVELOPMENT:
// Add SDKs for Firebase products that you want to use (see https://firebase.google.com/docs/web/setup#available-libraries)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getStorage, getDownloadURL, ref } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js";
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, where } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js"; 
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-analytics.js";
// For PRODUCTION:
// Tool will pack just the minimum required
//import { initializeApp } from 'firebase/app';
//import { getStorage, getDownloadURL, ref } from 'firebase/storage';
//import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore'; 
//import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const fCnfg = {
	apiKey: "AIzaSyAIQIelfXNtDjVSUKFyuxRXBORcit0IqpQ",
	authDomain: "mostarnakt.firebaseapp.com",
	projectId: "mostarnakt",
	storageBucket: "mostarnakt.appspot.com",
	messagingSenderId: "218060605304",
	appId: "1:218060605304:web:5d41d754a2bfef4f5baa8d",
	measurementId: "G-2FZTBRC558"
};

const app = initializeApp(fCnfg);
const st = getStorage(app);
const fs = getFirestore(app);

async function loadDoc(docDatabase, docCollection, docId, renderFunc) {		
	const r = doc(docDatabase, docCollection, docId);
	getDoc(r).then(function (docum) {
		renderFunc(docum);
	});
};

async function renderMainPage(doc) {
	const d = doc.data();
	document.getElementById("placeholder_cenik_cena").innerHTML = d.cenik_cena;
	document.getElementById("placeholder_cenik_popis").innerHTML = d.cenik_popis;
	document.getElementById("placeholder_rezervace_odst_1").innerHTML = d.rezervace_odst_1;
	document.getElementById("placeholder_rezervace_odst_2").innerHTML = d.rezervace_odst_2;
	document.getElementById("placeholder_prebytky_odst_1").innerHTML = d.prebytky_odst_1;
	document.getElementById("placeholder_mostovani_odst_1").innerHTML = d.mostovani_odst_1;
	document.getElementById("placeholder_mostovani_odst_2").innerHTML = d.mostovani_odst_2;
	document.getElementById("placeholder_mostovani_odst_3").innerHTML = d.mostovani_odst_3;
	document.getElementById("placeholder_kontakt_odst_1").innerHTML = d.kontakt_odst_1;
	document.getElementById("placeholder_kontakt_odst_2").innerHTML = d.kontakt_odst_2;
	document.getElementById("placeholder_kontakt_mapa").innerHTML = d.kontakt_mapa;
	document.getElementById("placeholder_kontakt_odst_3").innerHTML = d.kontakt_odst_3;
	document.getElementById("placeholder_kontakt_odst_4").innerHTML = d.kontakt_odst_4;	
};		

loadDoc(fs, "hlavni_stranka", "hlavni_stranka", renderMainPage);	

async function loadDocsWhereOrderBy(docDatabase, docCollection, docWhereField, docWhereOp, docWhereValue, docOderBy, docOrderByDir, renderFunc) {			
	const c = collection(docDatabase, docCollection);  	
	const q = query(c, where(docWhereField, docWhereOp, docWhereValue), orderBy(docOderBy, docOrderByDir));	
	getDocs(q).then(function (docs) {
		if (docs.size > 0) {
			renderFunc(docs);
		}
	});	
};

function isWhiteSpace(c) {
	return c == ' ' || c == '\t';
}

function isNameCharacter(c) {
	return (c >= 'a' && c <= 'z') ||  (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '_' || c == '-' || c == '.';
}

function processStorageLinksInText(t, counter, listOfAttachments, anchorIdPart) {
	let out = "";
	let locCounter = 0;
	let i = 0;
	const len = t.length;
	while (i < len) {
		// Read @STORAGE(
		if (i + 8 < len && t[i] == '@' && t[i + 1] == 'S' && t[i + 2] == 'T' && t[i + 3] == 'O' && t[i + 4] == 'R' && t[i + 5] == 'A' && t[i + 6] == 'G' && t[i + 7] == 'E' && t[i + 8] == '(') {
			let j = 9;
			while (i + j < len && isWhiteSpace(t[i + j])) j++;          // ignore white spaces
			let stBucket = "";                                          // read bucket name
			while (i + j < len && isNameCharacter(t[i + j])) stBucket += t[i + j++];  
			while (i + j < len && isWhiteSpace(t[i + j])) j++;          // ignore white spaces  
			if (i + j < len && t[i + j] == ',') {
				j++;                                                    // read comma
				while (i + j < len && isWhiteSpace(t[i + j])) j++;      // ignore white spaces
				let stFile = "";                                        // read file name
				while (i + j < len && isNameCharacter(t[i + j])) stFile += t[i + j++];
				while (i + j < len && isWhiteSpace(t[i + j])) j++;      // ignore white spaces
				if (i + j < len && t[i + j] == ",") {
					j++;                                                // read comma
					while (i + j < len && isWhiteSpace(t[i + j])) j++;  // ignore white spaces
					let stText = "";                                    // read link text 
					while (i + j < len && t[i + j] != ')') stText += t[i + j++];
				    if (i + j < len && t[i + j] == ")") {
						j++;                                            // read closing bracket
					    let id = "a_id_" + anchorIdPart + "_" + counter + "_" + locCounter++;  // create anchor ID
						var att = {};                                   // create an object with the information about the attachment
						att['anchorId'] = id;
						att['pathIsStorage'] = stBucket + '/' + stFile;
						listOfAttachments.push(att);		
					    out += '<a id="' + id + '" target="_blank">' + stText + '</a>';
					    i = i + j;                                      // continue with text after the link
					    continue;
					}
				}
			}			  		
		}
		out += t[i++];
	};	
	return out;
}

async function renderAktualityMaster(docs, elementId, anchorIdPart) {
	let s = "";
	let counter = 0;
	let listOfAttachments = [];	
	docs.forEach((doc) => {
		let d = doc.data();
		let t = processStorageLinksInText(d.text, counter++, listOfAttachments, anchorIdPart);
		s += `${t}<hr/>`;
	});
	let e = document.getElementById(elementId);
	e.innerHTML = s;
	listOfAttachments.forEach((att) => {
		let aid = att.anchorId;
		getDownloadURL(ref(st, att.pathIsStorage)).then((url) => {
			let anc = document.getElementById(aid);
			anc.href = url;
		}).catch((error) => {});
	});
};

async function renderAktuality(docs) {
	renderAktualityMaster(docs, "placeholder_aktuality", "aktuality");
}

async function renderAktualityArchiv(docs) {
	renderAktualityMaster(docs, "placeholder_aktuality_archiv", "aktuality_archiv");
}

loadDocsWhereOrderBy(fs, "aktuality", "zobrazit", "==", true, "cas", "desc", renderAktuality);	

async function loadDocsOrderBy(docDatabase, docCollection, docOderBy, docOrderByDir, renderFunc) {			
	const c = collection(docDatabase, docCollection);  	
	const q = query(c, orderBy(docOderBy, docOrderByDir));	
	getDocs(q).then(function (docs) {
		if (docs.size > 0) {
			renderFunc(docs);
		}
	});	
};

async function renderOdkazy(docs) {
	let s = "<ul>";
	docs.forEach((doc) => {
		let d = doc.data();
		s += `<li><a href="${d.odkaz}" target="_blank">${d.text}</a></li>`;
	});
	s += "</ul>";
	let e = document.getElementById("placeholder_odkazy");
	e.innerHTML = s;
};								

loadDocsOrderBy(fs, "odkazy", "cas", "desc", renderOdkazy);	

async function renderPrebytky(docs) {
	let s = `<h3>Aktuální nabídka:</h3><table class="table is-bordered"><tr><th>Položka</th><th>Popis</th><th>Kontakt</th></tr>`;	
	docs.forEach((doc) => {
		let d = doc.data();
		s += `<tr><td>${d.polozka}</td><td>${d.polozka}</td><td><a href="tel:${d.telefon.replace(/ /g, '-')}" >${d.telefon.replace(/ /g, '&nbsp;')}</a></td></tr>`;
	});
	s += "</table>";
	let e = document.getElementById("placeholder_prebytky");
	e.innerHTML = s;
};
						
loadDocsOrderBy(fs, "prebytky", "cas", "desc", renderPrebytky);

let btn = document.getElementById("btn_aktuality_show_all");
btn.disabled = false;
btn.onclick = () => {
	btn.disabled = true;
	loadDocsWhereOrderBy(fs, "aktuality", "zobrazit", "==", false, "cas", "desc", renderAktualityArchiv);	
}

getAnalytics(app);
