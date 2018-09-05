function expertisePicker(){
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + sheetid + "/" + expertiseTab + "/public/values?alt=json", function(data) {
	  if (data.feed.entry.length > 0) {
		for (var i = 0; i < data.feed.entry.length; i++) {
		  expertiseList.push(data.feed.entry[i].gsx$expertise.$t);
		}
	  }
		$( "#expertise" ).autocomplete({
			source: expertiseList,
			select: function (event, ui) {
				$("#expertise").val(ui.item.label);
				displayDepartments();
			}
		});
	});
}

function departmentsPicker(){
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + sheetid + "/" + departmentTab + "/public/values?alt=json", function(data) {
		if (data.feed.entry.length > 0) {
			for (var i = 0; i < data.feed.entry.length; i++) {
				var departmentRow = data.feed.entry[i];
				var departmentName = departmentRow.gsx$name.$t;
				departmentList.push(departmentName);
				var departmentEntry = {department:departmentRow.gsx$department.$t, description:departmentRow.gsx$description.$t, hosep:departmentRow.gsx$hosep.$t, hosepurl:departmentRow.gsx$hosepurl.$t, location:departmentRow.gsx$location.$t, logo:departmentRow.gsx$logo.$t, name:departmentRow.gsx$name.$t, webpage:departmentRow.gsx$webpage.$t, expertise:[]};
				departmentEntries[departmentName] = departmentEntry;
				departmentExpertise[departmentName] = [];
				departmentExpertise[departmentName].expertise = [];
			}
		}
		getDepartmentExpertise();
		$( "#departments" ).autocomplete({
			source: departmentList,
			select: function (event, ui) {
				$("#departments").val(ui.item.label);
				displayDepartments();
			}
		});
	});
}
  
function getDepartmentExpertise(){
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + sheetid + "/" + departmentExpertiseTab + "/public/values?alt=json", function(data) {
		if (data.feed.entry.length > 0) {
			for (var i = 0; i < data.feed.entry.length; i++) {
				var department = data.feed.entry[i].gsx$department.$t;
				var expertise = data.feed.entry[i].gsx$expertise.$t;
				departmentExpertise[department].expertise[departmentExpertise[department].expertise.length] = expertise;
				departmentEntries[department].expertise[departmentExpertise[department].expertise.length] = expertise;
			}
		}
		var updatedDate = new Date(data.feed.updated.$t);
		$('#lastupdated').html("Updated <br />" + $.datepicker.formatDate("dd-M-yy ", updatedDate) + updatedDate.toISOString().substr(11, 8));
		displayDepartments();
	});
}

function displayDepartments(){
	expertiseFilter=$("#expertise").val();
	departmentFilter=$("#departments").val();
	if( expertiseFilter == "" ){
		clearDepartments();
		for (var i = 0; i < departmentList.length; i++) {
			var department = departmentList[i];
			if(departmentFilter == department || department.toLowerCase().includes(departmentFilter.toLowerCase()) || departmentFilter == "" ){
				displayDepartment(department);
			}
		}
		drawDepartments();
	}else{
		$.getJSON("https://spreadsheets.google.com/feeds/list/" + sheetid + "/" + departmentExpertiseTab + "/public/values?alt=json", function(data) {
			if (data.feed.entry.length > 0) {
				clearDepartments();
				expertiseFilter=$("#expertise").val();
				departmentFilter=$("#departments").val();
				for (var i = 0; i < data.feed.entry.length; i++) {
				var department = data.feed.entry[i].gsx$department.$t;
				var expertise = data.feed.entry[i].gsx$expertise.$t;
					if(departmentFilter == department || department.toLowerCase().includes(departmentFilter.toLowerCase()) || departmentFilter == "" ){
						if(expertiseFilter == expertise || expertise.toLowerCase().includes(expertiseFilter.toLowerCase()) || expertiseFilter == ""){
							displayDepartment(department);
						}
					}
				}
				drawDepartments();
			}
		});
	}
}