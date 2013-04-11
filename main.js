/* MOCKS */

var mocked = {};

mocked.quickSettings = [{
	name: "Incognito",
	enabled: true
}, {
	name: "Internet",
	enabled: false
}, {
	name: "Local Discovery",
	enabled: true
}, {
	name: "Location",
	enabled: true
}, {
	name: "Payment",
	enabled: false
}, {
	name: "People",
	enabled: true
}, {
	name: "SMS & Telephony",
	enabled: false
}];


mocked.quickStatus = [{
	name: "Internet",
	status: false
}, {
	name: "GPS",
	status: true
}];


mocked.stores = [{
	name: "apps.webinos.org",
	allow: false
}, {
	name: "ubiapps.com",
	allow: true
}];


mocked.people = [{
	name: "Tardar Sauce",
	email: "grumpy@nonexistent.com",
	img: "person1.png",
	lastAccess: new Date().getTime()
}, {
	name: "Pokey Feline",
	email: "pokey@nonexistent.com",
	img: "person2.png",
	lastAccess: 1354421200428
}];

mocked.profiles = [{
	id: 1,
	name: "Home"
}, {
	id: 2,
	name: "Office"
}, {
	id: 3,
	name: "Trip to dad's"
}, {
	id: 4,
	name: "Misc"
}];

mocked.apps = {
	'kidsinfocus': {
		name: 'Kids In Focus'
	},
	'webinostravel': {
		name: 'Webinos Travel'
	},
	'littlespy': {
		name: 'Spy on your loved ones'
	},
	'ouroboros': {
		name: 'Prodigy of Ouroboros'
	}
}

mocked.permissions = [{
	id: 0,
	profileId: 3,
	name: "Navigation",
	app: "kidsinfocus",
	service: "gps",
	perm: 1 //1 allow, 0 prompt, -1 deny
}, {
	id: 1,
	profileId: 3,
	name: "Wifi",
	app: "kidsinfocus",
	service: "wifi",
	perm: 1
}, {
	id: 2,
	profileId: 3,
	name: "Photos",
	app: "webinostravel",
	service: "photo",
	perm: 1
}, {
	id: 3,
	profileId: 3,
	name: "Camera",
	app: "kidsinfocus",
	service: "video",
	perm: 0
}, {
	id: 4,
	profileId: 3,
	name: "GPS",
	app: "littlespy",
	service: "gps",
	perm: -1
}, {
	id: 5,
	profileId: 1,
	name: "Camera",
	app: "kidsinfocus",
	service: "video",
	perm: 1
}];


//mock generator
var generateMockedData = function(arrayObjectName, quantity) {
	var i = 0,
		randomnumber,
		destArr = mocked[arrayObjectName];

	for(i; i<quantity; i++) {
		if(arrayObjectName == 'stores') {
			destArr.push({
				name: "lorem.ipsum"+(i+1)+".com",
				allow: !!(Math.floor(Math.random()*2))
			});
		} else if(arrayObjectName == 'people') {
			destArr.push({
				name: "Loremford Ipsumov "+(i+1),
				email: "lorips"+(i+1)+"@nonexistent.com",
				lastAccess: 1341732300428-(123456789*i)
			});
		}
	}
}

// generate more mocked data
generateMockedData('stores', 3);
generateMockedData('people', 8);


//------------------------->8---CUT-HERE---------------------------------------------------------


var appData = {};
appData = mocked; //to be changed during the integration

/* GENERAL */


function removeClass(element, className) {
	if(typeof element != 'object') element = document.getElementById(element);
	var classString = element.className;
	var newClassString = '';
	var indexPos = classString.indexOf(className);
	if(indexPos == -1) {
		return;
	} else if (indexPos == 0) {
		newClassString = classString.substring(0, indexPos) + classString.substr(indexPos+className.length);
	} else {
		newClassString = classString.substring(0, indexPos-1) + classString.substr(indexPos+className.length);
	}

	element.className = newClassString;
}

function addClass(element, className) {
	if(typeof element != 'object') element = document.getElementById(element);
	var classString = element.className;
	if(classString != '') {
		var indexPos = classString.indexOf(className);
		if(indexPos == -1) {
			element.className += ' '+className;
		}
	} else {
		element.className = className;
	}
}

function selectItem(elements, active) {
	if(typeof elements == 'string') {
		elements = objectsForLater[elements];
	} else if(typeof elements != 'object' || (typeof elements == 'object' && isNaN(elements.length)) ) { //not an array
		console.log("selectItem: bad object type");
	}

	for(var i=0, j=elements.length; i<j; i++) {
		if(i == active) {
			addClass(elements[i], 'selected');
			continue;
		}
		removeClass(elements[i], 'selected');
	}
}

function getObjFromArrayById(id, array, returnWithPosition) {
	var i = 0,
		j = array.length;
	for(i; i<j; i++) {
		if(array[i].id == id) {
			var results;
			if(returnWithPosition) {
				result = {obj:array[i], pos:i};
			} else {
				results = array[i];
			}
			return result;
		}
	}
	return false;
}

function showPopup(popup) {
	objectsForLater.popupOverlay.style.display = "table";
	objectsForLater.popupOverlay.style.top = document.body.scrollTop+'px'; //center
	objectsForLater.popupContainer.style.display = "table-cell";
	popup.style.display = "block";
	document.body.style.overflow = "hidden";

	if(!popup.closeButtonsInitialized) {
		var closeButtons = popup.getElementsByClassName('popup-close'),
			i=0,
			j=closeButtons.length;

		for(i; i<j; i++) {
			closeButtons[i].onclick = (function(thisPopup, buttonAction) {
				return function() {
					if(typeof buttonAction == "function") buttonAction(); //previously declared onclick function
					closePopup(thisPopup);
				};
			})(popup, closeButtons[i].onclick);
		}

		popup.closeButtonsInitialized = true;
	}
}

function closePopup(popup) {
	objectsForLater.popupOverlay.style.display = "none";
	objectsForLater.popupContainer.style.display = "none";
	popup.style.display = "none";
	document.body.style.overflow = "visible";
}

function showPage(linkId) {
	var pageId = linkId.split("-")[1];
	if(pageId) {
		var page;
		if(objectsForLater.pages[pageId]) {
			page = objectsForLater.pages[pageId];
		} else {
			page = document.getElementById(pageId);
		}
		currentPage.style.display = "none";
		page.style.display = "block";
		currentPage = page;
	} else {
		console.log("Can't show this page, bad id");
	}
}

function disableQuickSettingsSwitch(name) {
	var quickSettings = appData.quickSettings,
		i = 0,
		j = quickSettings.length;

	for(i; i<j; i++) {
		if(quickSettings[i].name == name) {
			document.getElementById('myonoffswitch'+i).disabled = true;
			addClass('qsnl'+i, 'disabled');
			break;
		}
	}
}

function drawPermissionButtons(container, buttons, active) {
	if(typeof container != 'object') container = document.getElementById(container);

	var docFragment = document.createDocumentFragment();
	var buttonObjList = objectsForLater[container.id] = []; //if the container has no id, clicking will not work
	var tmpBtnObj;
	var i = 0,
		j = buttons.length;

	for(i;i<j;i++) {
		tmpBtnObj = document.createElement("div");
		tmpBtnObj.innerHTML = buttons[i].n;
		tmpBtnObj.className = "button "+buttons[i].c;

		tmpBtnObj.onclick = (function(buttons, clickedEl) {
			return function() {
				selectItem(buttons, clickedEl);
			};
		})(container.id, i);

		docFragment.appendChild(tmpBtnObj);
		buttonObjList.push(tmpBtnObj);
	}

	//set active button
	if(!active) {
		var active = 0;
	}
	addClass(buttonObjList[active], 'selected');

	//set class for number of buttons
	addClass(container, 'noOfButtons'+j);

	container.appendChild(docFragment);
}


/* DRAG & DROP */


function handleDragStart(e) { // this / e.target is the source node.
	this.style.opacity = '0.4';
	appData.dragSrcEl = this;
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData("text/plain", ""); //firefox needs this
	//console.log('drag start');
	//console.log(this);
}

function handleDragEnter(e) { // this / e.target is the current hover target.
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}
	addClass(this, 'over');
	appData.dragDestEl = this;
}

function handleDragOver(e) { // this / e.target is the current hover target.
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}
	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
	return false;
}

function handleDragLeave(e) { // this / e.target is previous target element.
	removeClass(this, 'over');
}

function handleDrop(e) { // this / e.target is current target element.
	if (e.stopPropagation) {
		e.stopPropagation(); // stops the browser from redirecting.
	}
	if (appData.dragSrcEl != this) {
		this.appendChild(appData.dragSrcEl);
		var id = appData.dragSrcEl.id;
		var columnId = this.id;
		var permission;
		if(columnId.indexOf('allow') != -1) {
			permission = 1;
		} else if(columnId.indexOf('prompt') != -1) {
			permission = 0;
		} else if(columnId.indexOf('deny') != -1) {
			permission = -1;
		}
		placesUpdatePermission(id, permission);
	}
	//console.log('drag drop');
	//console.log(this);
	return false;
}

function handleDragEnd(e) { // this/e.target is the source node.
	this.style.opacity = '1';
	removeClass(appData.dragDestEl, 'over');
	//console.log('drag end');
	//console.log(this);
}

function dragDropInitColumns() {
	var cols = document.querySelectorAll('.column');
	[].forEach.call(cols, function(col) {
		col.addEventListener('dragenter', handleDragEnter, false)
		col.addEventListener('dragover', handleDragOver, false);
		col.addEventListener('dragleave', handleDragLeave, false);
		col.addEventListener('drop', handleDrop, false);
	});
}
/*function dragDropInitDraggables() {
	var draggables = document.querySelectorAll('[draggable]');
	[].forEach.call(draggables, function(draggable) {
		draggable.addEventListener('dragstart', handleDragStart, false);
		draggable.addEventListener('dragend', handleDragEnd, false);
	});
}*/


/* DATE MANIPULATION */


function getDayName(date) {
	var dateNow = new Date();
	var dateYesterday = new Date();
	dateYesterday.setDate(dateNow.getDate() - 1);
	var givenYear = date.getFullYear(),
		givenMonth = date.getMonth(),
		givenDay = date.getDate();

	if (givenYear === dateNow.getFullYear() &&
		givenMonth === dateNow.getMonth() &&
		givenDay === dateNow.getDate()
		)
	{
		return 'Today';
	} else if (	givenYear === dateYesterday.getFullYear() &&
				givenMonth === dateYesterday.getMonth() &&
				givenDay === dateYesterday.getDate()
				)
	{
		return 'Yesterday';
	} else {
		if(givenDay<10) givenDay = '0'+givenDay;
		givenMonth+=1;
		if(givenMonth<10) givenMonth = '0'+givenMonth;
		return givenDay+'.'+givenMonth+'.'+givenYear;
	}
	/* else {
		var day = date.getDay();
		switch (day) {
		case 0:
			return 'Sunday';
			break;
		case 1:
			return 'Monday';
			break;
		case 2:
			return 'Tuesday';
			break;
		case 3:
			return 'Wednesday';
			break;
		case 4:
			return 'Thursday';
			break;
		case 5:
			return 'Friday';
			break;
		case 6:
			return 'Saturday';
			break;
		}
	}*/
}

function formatAMPM(date) {
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = hours >= 12 ? 'pm' : 'am';
	  var hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  strTime = hours + ':' + minutes + ' ' + ampm;
	  return strTime;
}


/* DRAW */


var objectsForLater = {}; //a place to gather all objects that I'm going to iterate later (onclick active class, and so on)

objectsForLater.pages = {}; //page initialization
objectsForLater.pages['quickSettings'] = document.getElementById('quickSettings');
var currentPage = objectsForLater.pages['quickSettings'];


var enableTabs = function() {
	var tabs = document.getElementById('tabs').children;

	var i = 0,
	j = tabs.length;

	for(i;i<j;i++) {
		tabs[i].onclick = (function(elements, clickedEl) {
			return function() {
				selectItem(elements, clickedEl);
				showPage(this.id);
			};
		})(tabs, i);
	}
}();

var enablePopups = function() {
	//init
	objectsForLater.popupOverlay = document.getElementById('popup_overlay');
	objectsForLater.popupContainer = document.getElementById('popup_container');

	//popups
	objectsForLater.popupTest = document.getElementById('popup-test');
		//objectsForLater.popupAddToPolicy = document.getElementById('popup-addToPolicy');
		//objectsForLater.popupPolicyEntity = document.getElementById('popup-policyEntity');
	objectsForLater.popupAddPermission = document.getElementById('popup-addPermission');
	objectsForLater.popupAddProfile = document.getElementById('popup-addProfile');
	objectsForLater.popupDeletePermission = document.getElementById('popup-deletePermission');
	objectsForLater.popupDeleteProfile = document.getElementById('popup-deleteProfile');

	//buttons opening popups
	document.getElementById('t-test').onclick = function() {showPopup(objectsForLater.popupTest)};
		//document.getElementById('t-add').onclick = function() {showPopup(objectsForLater.popupAddToPolicy)};

	objectsForLater.popupAddProfileId = document.getElementById('popup-addProfile-id');
	objectsForLater.popupAddProfileName = document.getElementById('popup-addProfile-name');
	document.getElementById('placesAddProfile').onclick = function() {profileEditPopup()};

	objectsForLater.popupAddPermissionId = document.getElementById('popup-addPermission-id');
	objectsForLater.popupAddPermissionName = document.getElementById('popup-addPermission-name');
	objectsForLater.popupAddPermissionApp = document.getElementById('popup-addPermission-app');
	objectsForLater.popupAddPermissionType = document.getElementById('popup-addPermission-type');
	objectsForLater.popupAddPermissionAction = document.getElementById('popup-addPermission-action');
	document.getElementById('placesAddAllow').onclick = function() {permissionEditPopup('allow')};
	document.getElementById('placesAddPrompt').onclick = function() {permissionEditPopup('prompt')};
	document.getElementById('placesAddDeny').onclick = function() {permissionEditPopup('deny')};
	document.getElementById('popup-deletePermission-confirm').onclick = function() {placesDeletePermission()};
	document.getElementById('popup-deleteProfile-confirm').onclick = function() {placesDeleteProfile()};

	//buttons inside popups
	document.getElementById('popup-addProfile-save').onclick = function() {placesAddEditProfile()};
	document.getElementById('popup-addPermission-save').onclick = function() {placesAddEditPermission()};

		//document.getElementById('popup-addToPolicy-profile').onclick = function() {policyEntityNewdit('profile')};
		//document.getElementById('popup-addToPolicy-object').onclick = function() {policyEntityNewdit('object')};
		//document.getElementById('popup-addToPolicy-service').onclick = function() {policyEntityNewdit('service')};

	/* policy entity edit tabs - quite verbose... but it seems like I don't need a function for anything similar to this */
	var popupAddPermissionSummaryTab = document.getElementById('popup-addPermission-summary-tab');
	var popupAddPermissionDetailsTab = document.getElementById('popup-addPermission-details-tab');
	var popupAddPermissionTabs = [popupAddPermissionSummaryTab, popupAddPermissionDetailsTab];
	objectsForLater.popupAddPermissionSummaryPage = document.getElementById('popup-addPermission-summary-content');
	objectsForLater.popupAddPermissionDetailsPage = document.getElementById('popup-addPermission-details-content');

	popupAddPermissionSummaryTab.onclick = function() {
		selectItem(popupAddPermissionTabs, 0);
		objectsForLater.popupAddPermissionSummaryPage.style.display = 'block';
		objectsForLater.popupAddPermissionDetailsPage.style.display = 'none';
	}
	popupAddPermissionDetailsTab.onclick = function() {
		selectItem(popupAddPermissionTabs, 1);
		objectsForLater.popupAddPermissionSummaryPage.style.display = 'none';
		objectsForLater.popupAddPermissionDetailsPage.style.display = 'block';
	}
	/* policy entity edit tabs END */

}();

var toolbarShowHide = function() {
	objectsForLater.toolbar = document.getElementById('toolbar');
	document.getElementById('toolbar-showhide').onclick = function() {
		if(objectsForLater.toolbar.style.maxHeight != '100%') {
			objectsForLater.toolbar.style.maxHeight = '100%';
			addClass(this, 'hide');
		} else {
			objectsForLater.toolbar.style.maxHeight = '10px';
			removeClass(this, 'hide');
		}
	};
}();

var drawQuickSettings = function() {
	var quickSettingsSwitchesContainer = document.getElementById('quickSettings-switches-content'),
		quickSettingsStatusContainer = document.getElementById('quickSettings-status-content'),
		html = '',
		quickSettings = appData.quickSettings || [],
		quickStatus = appData.quickStatus || [],
		i = 0,
		j = quickSettings.length,
		checked = '',
		active = '';

	for(i; i<j; i++) {
		if(quickSettings[i].enabled) {
			checked = ' checked';
		} else {
			checked = '';
		}

		html += '' +
			'<label id="qsnl'+i+'" class="onoffswitch-namelabel" for="myonoffswitch'+i+'">'+quickSettings[i].name+'</label>' +
			'<div class="onoffswitch">' +
				'<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch'+i+'"'+checked+'>' +
				'<label class="onoffswitch-label" for="myonoffswitch'+i+'">' +
					'<div class="onoffswitch-inner"></div>' +
					'<div class="onoffswitch-switch"></div>' +
				'</label>' +
			'</div>';
	}

	quickSettingsSwitchesContainer.innerHTML = html;

	//reset and continue
	html = '';
	i = 0;
	j = quickStatus.length;

	for(i; i<j; i++) {
		if(quickStatus[i].status) {
			active = ' active';
		} else {
			active = ' inactive';
			disableQuickSettingsSwitch(quickStatus[i].name);
		}

		html += '' +
			'<div class="qstatus-name">'+quickStatus[i].name+'</div><div class="qstatus-icon'+active+'" id="status-icon'+i+'"></div>';
	}

	quickSettingsStatusContainer.innerHTML = html;
}();


var drawStoreList = function() {
	var storeListContainer = document.getElementById('storeListContainer'),
		html = '',
		stores = appData.stores || [],
		i = 0,
		j = stores.length,
		checked;

	for(i; i<j; i++) {
		if(stores[i].allow) {
			checked = ' checked="checked"';
		} else {
			checked = '';
		}
		html += '' +
			'<div>' +
				'<input type="checkbox"'+checked+' id="store'+i+'">' +
				'<label for="store'+i+'">'+ stores[i].name +'</label>' +
			'</div>';
	}

	storeListContainer.innerHTML = html;

	drawPermissionButtons('unk-loc-per-con', [{n:"Allow",c:"allow"}, {n:"Allow once",c:"prompt"}, {n:"Deny",c:"deny"}], 1);
}();

var drawPeopleList = function() {
	var peopleListContainer = document.getElementById('people-list'),
		html = '',
		people = appData.people || [],
		i = 0,
		j = people.length,
		pic,
		date;

	for(i; i<j; i++) {
		if(!people[i].img) {
			pic = 'placeholder.png';
		} else {
			pic = people[i].img;
		}

		thaDate = new Date(people[i].lastAccess);

		html += '' +
			'<li>' +
				'<img src="img/'+pic+'">' +
				'<div class="name">'+ people[i].name +'</div>' +
				'<div class="email">'+ people[i].email +'</div>' +
				'<div class="lastused">Last used your personal zone: <span>'+ getDayName(thaDate)+', '+formatAMPM(thaDate) +'</span></div>' +
				'<div class="lastused-timestamp">'+ thaDate.getTime() +'</div>' +
				'<div class="button">Edit permissions</div>' +
			'</li>';
	}

	peopleListContainer.innerHTML = html;
}();


// list.js
var listOptions = {
    valueNames: ['name', 'email', 'lastused-timestamp']
};

var peopleList = new List('peoplePolicies', listOptions);
// end of list.js


var drawPlaces = function() {
	var docFrag = document.createDocumentFragment(),
		profiles = appData.profiles || [],
		i = 0,
		j = profiles.length;

	appData.places = {};
	objectsForLater.places = {};
	objectsForLater.places.profileListContainer = document.getElementById('places-profiles');
	objectsForLater.places.allow = document.getElementById('places-allow');
	objectsForLater.places.prompt = document.getElementById('places-prompt');
	objectsForLater.places.deny = document.getElementById('places-deny');
	objectsForLater.places.profiles = {};
	objectsForLater.places.permissions = {};

	for(i; i<j; i++) {
		createProfileListEntry(profiles[i], docFrag);
		if(i == 0) {
			setActiveProfile(profiles[i].id); //initial highlight
		}
	}

	objectsForLater.places.profileListContainer.appendChild(docFrag);
	dragDropInitColumns();

	if(profiles.length > 0) {
		drawPlacesPermissions(appData.places.currentProfileId);
	}

	//popup form
	var docFrag = document.createDocumentFragment(),
		option;
	for (var key in appData.apps) {
		if (appData.apps.hasOwnProperty(key)) {
			option = document.createElement("option");
			option.setAttribute('value', key);
			option.textContent = appData.apps[key].name;
			docFrag.appendChild(option);
		}
	}
	objectsForLater.popupAddPermissionApp.appendChild(docFrag);
}();

function createProfileListEntry(profile, parentElement) {
	var entry = document.createElement("div");
	entry.textContent = profile.name;
	entry.onclick = function() {placesOpenProfile(profile.id)};
	var controls = document.createElement("span");
	var edit = document.createElement("img");
	edit.src = "img/edit.png";
	edit.setAttribute('alt', 'Edit');
	edit.onclick = function(e) {e.stopPropagation(); profileEditPopup(profile.id);};
	var del = document.createElement("img");
	del.src = "img/delete.png";
	del.setAttribute('alt', 'Delete');
	del.onclick = function(e) {e.stopPropagation(); profileDeletePopup(profile.id);};
	controls.appendChild(edit);
	controls.appendChild(del);
	entry.appendChild(controls);
	parentElement.appendChild(entry);

	objectsForLater.places.profiles[profile.id] = entry;

	return entry;
}
function setActiveProfile(id) {
	appData.places.currentProfileId = id;
	var obj = objectsForLater.places.profiles[id];
	obj.className = 'selected'; //addClass ?
	objectsForLater.places.currentProfileDiv = obj;
}

function createPermissionEntry(permission, docFrag) {
	var entry,
		name,
		controls,
		edit,
		del;
	entry = document.createElement("div");
	entry.setAttribute('draggable', 'true');
	entry.id = permission.id;
	name = document.createElement("div");
	name.innerHTML = '<b>'+permission.name+'</b>@'+appData.apps[permission.app].name;
	entry.appendChild(name);
	controls = document.createElement("span");
	edit = document.createElement("img");
	edit.src = "img/edit.png";
	edit.setAttribute('alt', 'Edit');
	edit.onclick = function(e) {permissionEditPopup(permission.id);};
	del = document.createElement("img");
	del.src = "img/delete.png";
	del.setAttribute('alt', 'Delete');
	del.onclick = function(e) {permissionDeletePopup(permission.id);};
	controls.appendChild(edit);
	controls.appendChild(del);
	entry.appendChild(controls);

	docFrag.appendChild(entry);

	entry.addEventListener('dragstart', handleDragStart, false);
	entry.addEventListener('dragend', handleDragEnd, false);

	objectsForLater.places.permissions[permission.id] = name;

	return entry;
}

function drawPlacesPermissions(profileId) {
	if(!profileId) return false;

	objectsForLater.places.allow.innerHTML = '';
	objectsForLater.places.prompt.innerHTML = '';
	objectsForLater.places.deny.innerHTML = '';

	var docFragAllow = document.createDocumentFragment(),
		docFragPrompt = document.createDocumentFragment(),
		docFragDeny = document.createDocumentFragment(),
		permissions = appData.permissions || [],
		i = 0,
		j = permissions.length;

	for(i; i<j; i++) {
		if(permissions[i].profileId == profileId) {
			if(permissions[i].perm == 1) {
				docFrag = docFragAllow;
			} else if(permissions[i].perm == 0) {
				docFrag = docFragPrompt;
			} else if(permissions[i].perm == -1) {
				docFrag = docFragDeny;
			}

			createPermissionEntry(permissions[i], docFrag);
		}
	}
	objectsForLater.places.allow.appendChild(docFragAllow);
	objectsForLater.places.prompt.appendChild(docFragPrompt);
	objectsForLater.places.deny.appendChild(docFragDeny);

	//dragDropInitDraggables();
}

function placesOpenProfile(id) {
	//de-highlight old one
	if(objectsForLater.places.currentProfileDiv) {
		removeClass(objectsForLater.places.currentProfileDiv, 'selected');
	}
	//set active + higlight + draw
	setActiveProfile(id);
	drawPlacesPermissions(id);
}

function placesAddEditProfile() {
	var newName = objectsForLater.popupAddProfileName.value;
	if(newName == '') return;

	var id = objectsForLater.popupAddProfileId.value,
		profile;
	if(!id) { //new
		profile = {};
		profile.id = new Date().valueOf();
		profile.name = newName;

		appData.profiles.push(profile);
		//draw
		var docFrag = document.createDocumentFragment();
		createProfileListEntry(profile, docFrag);

		if(!appData.places.currentProfileId) {
			setActiveProfile(profile.id);
		}

		objectsForLater.places.profileListContainer.appendChild(docFrag);
	} else { //edit
		profile = getObjFromArrayById(id, appData.profiles);
		if(!profile) return;

		profile.name = newName;
		//re-draw
		objectsForLater.places.profiles[id].textContent = newName;
	}
}

function placesDeleteProfile() {
	var id = appData.places.profileToDelete;
	//delete profile
	var profile = getObjFromArrayById(id, appData.profiles, true);
	appData.profiles.splice(profile.pos,1);
	var profileDiv = objectsForLater.places.profiles[id];
	profileDiv.parentNode.removeChild(profileDiv);

	var removePermissionsHtml = false;
	if(appData.places.currentProfileId == id) { //if current profile is being deleted select first one
		if(appData.profiles.length > 0) {
			setActiveProfile(appData.profiles[0].id);
		} else {
			appData.places.currentProfileId = undefined;
			removePermissionsHtml = true; //no other profile, so we must clear permissions from the view
		}
	}
	//remove permissions AFTER profile change, to avoid pointless redraws
	var permissions = appData.permissions,
		i = 0,
		j = permissions.length;

	for(i; i<j; i++) {
		if(permissions[i].profileId == id) {
			appData.permissions.splice(i,1);
			if(removePermissionsHtml) {
				var permissionDiv = objectsForLater.places.permission[id].parentNode; //one node higher
				permissionDiv.parentNode.removeChild(permissionDiv);
			}
			i--; //compensate for the missing element
			j--;
		}
	}
	appData.places.profileToDelete = undefined;
}

function placesAddEditPermission() {
	var newName = objectsForLater.popupAddPermissionName.value;
	if(newName == '') return; //TODO or something default?

	var app = objectsForLater.popupAddPermissionApp.value;
	var type = objectsForLater.popupAddPermissionType.value;
	var perm = objectsForLater.popupAddPermissionAction.value;
	var destColumn;
	if(perm == 'allow') {
		perm = 1;
		destColumn = objectsForLater.places.allow;
	} else if(perm == 'prompt') {
		perm = 0;
		destColumn = objectsForLater.places.prompt;
	} else if(perm == 'deny') {
		perm = -1;
		destColumn = objectsForLater.places.deny;
	}

	var id = objectsForLater.popupAddPermissionId.value,
		permission;

	if(!id) { //new
		permission = {};
		permission.id = new Date().valueOf();
		permission.profileId = appData.places.currentProfileId,
		permission.name = newName;
		permission.app = app;
		permission.service = type;
		permission.perm = perm;

		appData.permissions.push(permission);

		//draw
		var docFrag = document.createDocumentFragment();
		createPermissionEntry(permission, docFrag);
		destColumn.appendChild(docFrag);
	} else { //edit
		permission = getObjFromArrayById(id, appData.permissions);
		if(!permission) return;

		permission.name = newName;
		permission.app = app;
		permission.service = type;
		permission.perm = perm;
		//re-draw
		objectsForLater.places.permissions[id].innerHTML = '<b>'+permission.name+'</b>@'+appData.apps[permission.app].name;
	}
}

function placesUpdatePermission(id, permission) {
	var permissionObj = getObjFromArrayById(id, appData.permissions);
	if(!permissionObj) return;
	if(!isNaN(permission)) permissionObj.perm = permission;
}

function placesDeletePermission() {
	var id = appData.places.permissionToDelete;
	var permission = getObjFromArrayById(id, appData.permissions, true);
	appData.permissions.splice(permission.pos,1);
	var permissionDiv = objectsForLater.places.permissions[id].parentNode; //one node higher
	permissionDiv.parentNode.removeChild(permissionDiv);
	appData.places.permissionToDelete = undefined;
}

function profileEditPopup(id) {
	if(!id) { //new
		objectsForLater.popupAddProfileId.value = '';
		objectsForLater.popupAddProfileName.value = '';
	} else {
		var profile = getObjFromArrayById(id, appData.profiles);
		objectsForLater.popupAddProfileId.value = profile.id;
		objectsForLater.popupAddProfileName.value = profile.name;
	}
	showPopup(objectsForLater.popupAddProfile);
}

function permissionEditPopup(newPermissionOrId) {
	if(isNaN(newPermissionOrId)) { //new
		if(newPermissionOrId == "allow" || newPermissionOrId == 'prompt' || newPermissionOrId == 'deny') {
			objectsForLater.popupAddPermissionAction.value = newPermissionOrId;
		} else {
			objectsForLater.popupAddPermissionAction.options[0].selected = "selected";
		}
		//reset other fields
		objectsForLater.popupAddPermissionId.value = '';
		objectsForLater.popupAddPermissionName.value = '';
		objectsForLater.popupAddPermissionApp.options[0].selected = "selected";
		objectsForLater.popupAddPermissionType.options[0].selected = "selected";
	} else { //edit
		var permission = getObjFromArrayById(newPermissionOrId, appData.permissions);

		var permValue;
		if(permission.perm == 1) {
			permValue = 'allow';
		} else if(permission.perm == 0) {
			permValue = 'prompt';
		} else if(permission.perm == -1) {
			permValue = 'deny';
		}

		objectsForLater.popupAddPermissionId.value = permission.id;
		objectsForLater.popupAddPermissionName.value = permission.name;
		objectsForLater.popupAddPermissionApp.value = permission.app;
		objectsForLater.popupAddPermissionType.value = permission.type;
		objectsForLater.popupAddPermissionAction.value = permValue;
	}
	showPopup(objectsForLater.popupAddPermission);
}

function permissionDeletePopup(id) {
	appData.places.permissionToDelete = id; //TODO meh
	showPopup(objectsForLater.popupDeletePermission);
}

function profileDeletePopup(id) {
	appData.places.profileToDelete = id;
	showPopup(objectsForLater.popupDeleteProfile);
}