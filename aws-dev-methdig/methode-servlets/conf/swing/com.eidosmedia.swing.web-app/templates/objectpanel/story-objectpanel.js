/**
 * Custom object panel registration
 * See "ObjectPanel" documentation for further details.
 */
 var globalctx;

(function() {
    eidosmedia.webclient.extensions.objectpanel.register( ["EOM::Story","EOM::CompoundStory"], "story-objectpanel.html", {
        // refreshOnShow
        // If set to true, the objectPanel will refresh ( and call all the subsequent methods, e.g. _preFillForm_ and _postFillForm_ ),
        // any time the object Panel tab is selected by the user ( except for the first time ).
        refreshOnShow: false,

        //closeOnHide
        //If set to true, the onClose method, if available, will be called any time the objectPanel tab loses focus ( another tab is opened ).
        closeOnHide: false,

        init: function( ctx ) {
            /* Method called on the object panel initialization.
			    It can be used to initialize internal variables, load external sources...

			    Please notice that, at this point, the DOM elements of your HTML template are
			    already available, so it is possible to use jQuery or vanilla Javascript selectors.

			    NOTE: the metadata has not be loaded yet in this phase.
			    See below for further details on the parameters.

			    See the following paragraphs to obtain further details on the Context Object.
            */

				globalctx=ctx;
        },

        ready: function( ctx ) {
            /* Method called when the object panel is ready and the metadata has been loaded.            */
        },

        processXML: function( ctx ) {
			/*
				Method called before saving.
				In this method, it is possible to modify the metadata BEFORE
				it is saved to the server.

				NOTE: this method MUST return the metadataXML to work properly.
				NOTE: relying on the return value, any operation MUST BE synchronous.
            */

            var metadataXML = ctx.activeObj.getMetadataXML();
			/** Some elaboration ... **/
    		return metadataXML;
        },
        
        preFillForm: function( ctx ) {
            /* Method called on the object panel initialization.
                It can be used to initialize internal variables, load external sources...
                Please notice that, at this point, the DOM elements of your HTML template are
                already available, so it is possible to use jQuery or vanilla Javascript selectors.
                NOTE: the metadata has not be loaded yet in this phase.
                See below for further details on the parameters.
                See the following paragraphs to obtain further details on the Context Object.

                NOTE: The DOM elements of the HTML templates are available but have NOT been initialized ( so, they contain no value ).
            */

				console.log("ObjPanel: preFillForm");
				var metadataXML = ctx.activeObject.getMetadataXML();
				initdocumentInfo(ctx);
				var syndicate_value = $(metadataXML).find(
					'metadata > rights > Newsservice').text();
				console.log("Syndicate Flag is" + syndicate_value);
		
				if (syndicate_value == 'true' || syndicate_value == 'TRUE') {
					document.getElementById("SyndicationembargoDate").disabled = true;
					document.getElementById("SyndicationembargoDateID").className = "input-append date emui-field-disabled";
				} else {
					document.getElementById("SyndicationembargoDate").disabled = false;
					document.getElementById("SyndicationembargoDateID").className = "input-append date emui-field-enabled";
				}
		
				var isChannelCopy = ctx.activeObject.getInfo().bundlechild;
		
				$("#courtesyMessage").css("display", isChannelCopy ? 'block' : 'none');
				$("#objPanelContent").css("display", !isChannelCopy ? 'block' : 'none');
				$("#footerButtons").css("display", !isChannelCopy ? 'block' : 'none');
		
				var isAreaGeneric = ctx.area.getName() == "generic" ? true : false;
		
				$("#courtesyMessage").css("display", isAreaGeneric ? 'block' : 'none');
				$("#objPanelContent").css("display", !isAreaGeneric ? 'block' : 'none');
				$("#footerButtons").css("display", !isAreaGeneric ? 'block' : 'none');
		
				if (isAreaGeneric) {
					$(".em-objectpanel #courtesyMessage")
						.text(
							"You\'ve selected a story. Please, click outside it to return to DWP's Metadata instead.");
				} else {
					$(".em-objectpanel #courtesyMessage")
						.text(
							"This is a channel copy. Please, select the main copy to edit metadata.");
				}
		
				if (isChannelCopy) {
					return;
				}
        },

        postFillForm: function( ctx ) {
            /*
             * Method called when the object panel is ready and the metadata has been loaded.
             * It can be used to add custom listeners to buttons, make some elaborations, etc..
             */
			console.log("ObjPanel: postFillForm");
			var metadataXML = ctx.activeObject.getMetadataXML();
			var syndicate_value = $(metadataXML).find(
				'metadata > rights > Newsservice').text();
			checkFlags();
			selectTemplate();
			loadHexcolor();
			console.log("### getexclusiveExp ### "
				+ $(metadataXML).find(
					'metadata > digitalPub > flags > exclusiveExp').text());
			getexclusiveExp($(metadataXML).find(
				'metadata > digitalPub > flags > exclusiveExp').text());
			getnewExp($(metadataXML).find('metadata > digitalPub > flags > newExp')
				.text());
			getupdatedIp($(metadataXML).find(
				'metadata > digitalPub > flags > updatedExp').text());
			getSponsored($(metadataXML).find(
				'metadata > digitalPub > flags > sponsoredExp').text());
			updateArticleThemeUI();
	
			if (syndicate_value == 'true' || syndicate_value == 'TRUE') {
				document.getElementById("SyndicationembargoDate").disabled = true;
				document.getElementById("SyndicationembargoDateID").className = "input-append date emui-field-disabled";
			} else {
				document.getElementById("SyndicationembargoDate").disabled = false;
				document.getElementById("SyndicationembargoDateID").className = "input-append date emui-field-enabled";
			}
	
			if($(metadataXML).find('metadata > digitalPub > enable > premoderation').text()=='true')
			{
				$("#premoderation_hid").val('true');
				$("#post-comments-moderation").prop("checked", false);
				$("#pre-comments-moderation").prop("checked", true);
		
			}
			else{
				$("#premoderation_hid").val('false');
				$("#pre-comments-moderation").prop("checked", false);			
				$("#post-comments-moderation").prop("checked", true);
	
			}
	
	
			var isChannelCopy = ctx.activeObject.getInfo().bundlechild;
	
			if (isChannelCopy) {
				return;
			}

        },

        validate: function(ctx) {
			console.log("ObjPanel: validate");
            return true;
        },

        preSave: function( ctx ) {
            /* Method called before saving.
               In this method, it is possible to modify the metadata BEFORE
               it is saved to the server.
               NOTE: this method MUST return the metadataXML to work properly.
               NOTE: relying on the return value, any operation MUST BE synchronous.
            */
			console.log("ObjPanel: preSave");
            var metadataXML = ctx.activeObj.getMetadataXML();

			var isChannelCopy = ctx.activeObject.getInfo().bundlechild;	
			if (isChannelCopy) {
				return metadataXML;
			}
	
			return metadataXML;
        },

        postSave: function( ctx ) {
            // Method called after saving.
			// For example, we can refresh Metadata
			console.log("ObjPanel: postSave");
			console.log("ObjPanel: Refreshing metadata");
			ctx.activeObject.refreshMetadata();

		},

        onClose: function( ctx ) {
            /*
             * Method called when the objectpanel is closed.
             * This happens when a document is closed, when a different element is selected,
             * or when the objectPanel tab is hidden ( in case of closeOnHide set to true).
             */
        },
        onUpdatesAvailable: function( ctx ) {
			// For example, we can refresh Metadata
		},
		onEvent: function( evt, ctx ) {
			// For example, we can refresh Metadata
		}
    });
})();

function initdocumentInfo(ctx) {
	var creation_epochtime = ctx.activeObject.getInfo().created;

	var c_date = new Date(creation_epochtime * 1000);
	var c_day = '0' + c_date.getDate();

	var c_month_tmp = c_date.getMonth() + 1;
	c_month_tmp = '0' + c_month_tmp;
	var c_month = c_month_tmp.slice(-2);

	var c_year = c_date.getFullYear();
	var c_hour = '0' + c_date.getHours();
	var c_mins = '0' + c_date.getMinutes();

	var c_fullDate = c_day.slice(-2) + "/" + c_month + "/" + c_year + "  "
		+ c_hour.slice(-2) + ":" + c_mins.slice(-2);

	var modifier_epochtime = ctx.activeObject.getInfo().modified;

	var m_date = new Date(modifier_epochtime * 1000);
	var m_day = '0' + m_date.getDate();

	var m_month_tmp = m_date.getMonth() + 1;
	m_month_tmp = '0' + m_month_tmp;
	var m_month = m_month_tmp.slice(-2);

	var m_year = m_date.getFullYear();
	var m_hour = '0' + m_date.getHours();
	console.log("Hour is  :" + m_hour);
	var m_mins = '0' + m_date.getMinutes();
	var m_fullDate = m_day.slice(-2) + "/" + m_month + "/" + m_year + "  "
		+ m_hour.slice(-2) + ":" + m_mins.slice(-2);

	$('#creator-content').html(
		c_fullDate + " by  " + ctx.activeObject.getInfo().creator);
	$('#modifier-content').html(
		m_fullDate + " by  " + ctx.activeObject.getInfo().last_modifier);
	$('#status-content').html(ctx.activeObject.getInfo().statusInfo.name);
	try {
		if (ctx.activeObject.getInfo().attributes_json.metadata.webPub)
			$('#article-type')
				.html(
					ctx.activeObject.getInfo().attributes_json.metadata.webPub.type);
	} catch (exp) {
		console.log(exp);
	}

	console.log("#### Object Info for current document");
	console.log(ctx.activeObject.getInfo());

}

function stickyheaddsadaer(obj) {
	console.log("Syndicate CheckBox is triggered");
	if ($(obj).is(":checked")) {
		document.getElementById("SyndicationembargoDate").disabled = true;
		document.getElementById("SyndicationembargoDateID").className = "input-append date emui-field-disabled";
	} else {
		document.getElementById("SyndicationembargoDate").disabled = false;
		document.getElementById("SyndicationembargoDateID").className = "input-append date emui-field-enabled";
	}
}

function upDatepuffTopicId(sel)
{
	console.log("### Selected value is ### " + sel.options[sel.selectedIndex].text );
	$('#puffTopic').val(sel.options[sel.selectedIndex].text);
}

function updateColorpicker(sel)
{
	console.log("### Selected color is ### " + $(sel).val());
	$('#colorPickermeta').val($(sel).val());
}

function selectTemplate(){
	console.log("### Current Template is ### "+ $('#sliceTemplate').val());
	switch($('#sliceTemplate').val()) {
	case 'obituaries':
		document.getElementById("obituaries").style.display='block';
		document.getElementById("puffs").style.display='none';
		break;
	  case 'puffs':
		document.getElementById("puffs").style.display='block';
		document.getElementById("obituaries").style.display='none';
		break;
	  default:
		document.getElementById("obituaries").style.display='none';
		document.getElementById("puffs").style.display='none';
	}
}

function loadHexcolor()
{
	valHex = $('#colorPickermeta').val()
	$('#colorPicker').spectrum({
	color: valHex,
	change: function(color) {
		$('#hexColor').val(color);
	},
	hide: function(color) {
		$('#hexColor').val(color);
	},
	showPalette: true,
	showPaletteOnly: true,
	hideAfterPaletteSelect:true,
	maxSelectionSize: 1,
	preferredFormat: "hex",
	palette: ['#0299A0', '#F3981D', '#EA5570', '#6E9D2E', '#6393CB', '#00A59A', '#BAA7A1','#E06618','#AC86AA']
});

$('#colorPicker').val(valHex);
}

function checkFlags() {
	var len = $("#flags input[type='checkbox']:checked").length;
	console.log(" ### checked values ### " + len);

	if ($("#newExp").is(':checked')) {
		$('#isNewDaysExp').removeAttr('disabled');
		$('#isNewHoursExp').removeAttr('disabled');
		$('#isNewMinsExp').removeAttr('disabled');
		if($('#isNewHoursExp').val() ==''){
			$('#isNewHoursExp').val('3');
			setnewExp();
		}

	} else {
		$('#isNewDaysExp').attr('disabled', true);
		$('#isNewHoursExp').attr('disabled', true);
		$('#isNewMinsExp').attr('disabled', true);
		
	}
	if ($("#updatedExp").is(':checked')) {
		$('#isUpdatedDaysExp').removeAttr('disabled');
		$('#isUpdatedHoursExp').removeAttr('disabled');
		$('#isUpdatedMinsExp').removeAttr('disabled');
		if($('#isUpdatedHoursExp').val() ==''){
			$('#isUpdatedHoursExp').val('3');
			setupdatedIp();
		}
	} else {
		$('#isUpdatedDaysExp').attr('disabled', true);
		$('#isUpdatedHoursExp').attr('disabled', true);
		$('#isUpdatedMinsExp').attr('disabled', true);
	}
	if ($("#exclusiveExp").is(':checked')) {
		$('#isExclusiveDaysExp').removeAttr('disabled');
		$('#isExclusiveHoursExp').removeAttr('disabled');
		$('#isExclusiveMinsExp').removeAttr('disabled');
	} else {
		$('#isExclusiveDaysExp').attr('disabled', true);
		$('#isExclusiveHoursExp').attr('disabled', true);
		$('#isExclusiveMinsExp').attr('disabled', true);
	}
	if ($("#sponsoredExp").is(':checked')) {
		$('#isSponsoredDaysExp').removeAttr('disabled');
		$('#isSponsoredHoursExp').removeAttr('disabled');
		$('#isSponsoredMinsExp').removeAttr('disabled');
	} else {
		$('#isSponsoredDaysExp').attr('disabled', true);
		$('#isSponsoredHoursExp').attr('disabled', true);
		$('#isSponsoredMinsExp').attr('disabled', true);
	}
}
function updateNewExp(obj) {
	if ($(obj).is(":checked")) {
		$('#updatedExp').attr('checked', false);
	}
	checkFlags();

}
function updateUpdatedExp(obj) {
	if ($(obj).is(":checked")) {
		$('#newExp').attr('checked', false);
	}
	checkFlags();

}
function updateExclusiveExp(obj) {
	if ($(obj).is(":checked")) {
		$('#sponsoredExp').attr('checked', false);
	}
	checkFlags();

}
function updateSponsoredExp(obj) {
	if ($(obj).is(":checked")) {
		$('#exclusiveExp').attr('checked', false);
	}
	checkFlags();
}

function setexclusiveExp() {
	document.getElementById("isexclusiveExp").value = (document
		.getElementById("isExclusiveDaysExp").value)
		+ "-"
		+ (document.getElementById("isExclusiveHoursExp").value)
		+ "-" + (document.getElementById("isExclusiveMinsExp").value);

	var tmp = (document.getElementById("isExclusiveDaysExp").value) + "-"
		+ (document.getElementById("isExclusiveHoursExp").value) + "-"
		+ (document.getElementById("isExclusiveMinsExp").value);

}

function getexclusiveExp(newExp) {
	console.log("### exclusiveExp  starting is ### " + newExp);
	var hiddenExp = newExp.split("-");

	if (hiddenExp.length != 3) {
		hiddenExp = ["", "", ""];
	}
	document.getElementById("isExclusiveDaysExp").value = hiddenExp[0];
	document.getElementById("isExclusiveHoursExp").value = hiddenExp[1];
	document.getElementById("isExclusiveMinsExp").value = hiddenExp[2];

}

function setnewExp() {
	document.getElementById("isnewExp").value = (document
		.getElementById("isNewDaysExp").value)
		+ "-"
		+ (document.getElementById("isNewHoursExp").value)
		+ "-"
		+ (document.getElementById("isNewMinsExp").value);

	var tmp = (document.getElementById("isNewDaysExp").value) + "-"
		+ (document.getElementById("isNewHoursExp").value) + "-"
		+ (document.getElementById("isNewMinsExp").value);

}

function getnewExp(newExp) {
	console.log("### exclusiveExp  starting is ### " + newExp);
	var hiddenExp = newExp.split("-");

	if (hiddenExp.length != 3) {
		hiddenExp = ["", "", ""];
	}
	document.getElementById("isNewDaysExp").value = hiddenExp[0];
	document.getElementById("isNewHoursExp").value = hiddenExp[1];
	document.getElementById("isNewMinsExp").value = hiddenExp[2];

}

function setupdatedIp() {
	document.getElementById("isUpdatedIp").value = (document
		.getElementById("isUpdatedDaysExp").value)
		+ "-"
		+ (document.getElementById("isUpdatedHoursExp").value)
		+ "-"
		+ (document.getElementById("isUpdatedMinsExp").value);

	var tmp = (document.getElementById("isUpdatedDaysExp").value) + "-"
		+ (document.getElementById("isUpdatedHoursExp").value) + "-"
		+ (document.getElementById("isUpdatedMinsExp").value);

}

function getupdatedIp(newExp) {
	var hiddenExp = newExp.split("-");

	if (hiddenExp.length != 3) {
		hiddenExp = ["", "", ""];
	}
	document.getElementById("isUpdatedDaysExp").value = hiddenExp[0];
	document.getElementById("isUpdatedHoursExp").value = hiddenExp[1];
	document.getElementById("isUpdatedMinsExp").value = hiddenExp[2];

}

function setSponsored() {
	document.getElementById("issponsoredExp").value = (document
		.getElementById("isSponsoredDaysExp").value)
		+ "-"
		+ (document.getElementById("isSponsoredHoursExp").value)
		+ "-" + (document.getElementById("isSponsoredMinsExp").value);

	var tmp = (document.getElementById("isSponsoredDaysExp").value) + "-"
		+ (document.getElementById("isSponsoredHoursExp").value) + "-"
		+ (document.getElementById("isSponsoredMinsExp").value);

}

function getSponsored(newExp) {
	var hiddenExp = newExp.split("-");

	if (hiddenExp.length != 3) {
		hiddenExp = ["", "", ""];
	}
	document.getElementById("isSponsoredDaysExp").value = hiddenExp[0];
	document.getElementById("isSponsoredHoursExp").value = hiddenExp[1];
	document.getElementById("isSponsoredMinsExp").value = hiddenExp[2];

}

function updateArticleThemeUI() {
	var template = document.getElementById("articleTemplate").value;
	updateThemeFromTemplate(template);
}

function updateThemeFromTemplate(templateId) {
	console.log("### return templateId  ### " + templateId);
	console.log("### return themes  ### " + getArticleThemes());

	var themes = getArticleThemes()[templateId];
	console.log("### return string ### " + themes);
	if (themes != null) {
		$(".articleTheme").show();
		$("#articleTheme").empty();
		for (var i = 0; i < themes.length; i++) {
			$("#articleTheme").append(
				'<option value="' + themes[i]["value"] + '">'
				+ themes[i]["label"] + '</option>')
		}
	} else {
		$(".articleTheme").hide();
		$("#articleTheme").empty();
		$("#articleTheme").append('<option value=""></option>')
	}
	if (templateId == "supplement-in-depth") {
		$("#supplement-in-depth").show();
	} else {
		$("#supplement-in-depth").hide();
	}
}

function getArticleThemes() {
	var siteconf = globalctx.getSiteConfigFragment("/siteConfiguration/methodeInstance");
	var xml = $.parseXML(siteconf.toString());
	var instance = $(xml).find('methodeInstance').attr('value');
	console.log("### siteconfig String ### " + instance);

	var isST = instance.toLowerCase().indexOf("sunday") != -1;
	var jsonStr = '{' + '	"default": null,'
		+ '	"major-default": [{"label": "Default" , "value": ""},'
		+ '					{"label": "DefCon", "value": "defcon"}],'
		+ '	"opinion-default": null,' + '	"supplement-default":';
	if (isST) {
		jsonStr += '[{"label": "", "value": ""},'
			+ '{"value": "culture", "label": "Culture"},'
			+ '{"value": "style", "label": "Style"},'
			+ '{"value": "sunday-times-magazine", "label": "Sunday Times Magazine"}],';
	} else {
		jsonStr += '[{"value": "times-magazine", "label": "Times Magazine"}],';
	}
	jsonStr += '	"supplement-columnist": ';
	if (isST) {
		jsonStr += '[{"label": "", "value": ""},'
			+ '{"value": "culture", "label": "Culture"},'
			+ '{"value": "style", "label": "Style"},'
			+ '{"value": "sunday-times-magazine", "label": "Sunday Times Magazine"}],';
	} else {
		jsonStr += '[{"value": "times-magazine", "label": "Times Magazine"}],';
	}
	jsonStr += '	"supplement-in-depth": ';
	if (isST) {
		jsonStr += '[{"label": "", "value": ""},'
			+ '{"value": "culture", "label": "Culture"},'
			+ '{"value": "style", "label": "Style"},'
			+ '{"value": "sunday-times-magazine", "label": "Sunday Times Magazine"}]';
	} else {
		jsonStr += '[{"value": "times-magazine", "label": "Times Magazine"}]';
	}
	jsonStr += '}';
	console.log("### return string ### " + jsonStr);

	return JSON.parse(jsonStr);

}


function generateSlug() {
	//var template = document.getElementById("friendlyUrl").value;
	globalctx.activeObject.getChannelCopiesList(function (err, list) {
		if (err) {
			ctx.showError(err);
			return;
		}
		console.log("### Getting channel document  ###");
		for (var i = 0; i < list.length; i++) {
			if (list[i].info.channelIdentifier.length > 0 && list[i].info.channelIdentifier.indexOf("Digital") > 0) {
				console.log("### Path of Digital Channel document ###" + list[i].info.path);
				
				globalctx.getContentByPath( list[i].info.path, { cached: false }, function(err, content) {
					if (err) {
						globalctx.showError(err);
						return;
					}
					try{
						xmlDoc = $.parseXML( content ),
						$xml = $( xmlDoc );
						
						if($xml.find( "web-headline" ).text().length > 0) {
							$title = $xml.find( "web-headline" );
							console.log("### Title of the document channel from seo headline  ###" + $title.text());
							document.getElementById("friendlyUrl").value = slugify($title.text());
						}
						else {
							$title = $xml.find( "headline" );
							console.log("### Title of the document from headline  ###" + $title.text());
							document.getElementById("friendlyUrl").value = slugify($title.text());

						}
					}
					catch(ex)
					{
						console.log(ex)
					}
					//console.log("### Digital channel content  ###" + content);
				});
			}
			else{
				console.log("Current channel is not Digital channel")
			}

		}
	});
}


function slugify(text) {

				
		var rawText = text.toString()
		  .replace(/\uFB00/g, 'ff')
		  .replace(/\uFB01/g, 'fi')
		  .replace(/\uFB02/g, 'fl')
		  .replace(/\uFB03/g, 'ffi')
		  .replace(/\uFB04/g, 'ffl');
		
		return rawText.toString().toLowerCase().trim()
			.replace(/[\s\W_]+/g, '-').replace(/(^-)|(-$)/g, '');
	
	}


	function checkCanonicalLink() {
		var baseUrl = eidosmedia.webclient.app.context +"/eddevServices/rest/urlProxy/checkResource?resource=";
		var syndicationUrl = $("#canonicalLink").val();
		var url = baseUrl+syndicationUrl;
	   console.log("### url generated is ### " + url);

		   $.ajax({
				type: "GET",
				url: url,
				dataType: "jsonp",
				success: function(response) {
					console.log("### Response Status is  ### " + response.status);
					if(response.status === 200) {
						$('#canonicalLink').css('border-color', '#00FF00');
					} else {
						$('#canonicalLink').css('border-color', '#FF0000');
					}
				},
				error: function(response, textStatus, errorThrown) {
					console.log("### Response  is ### " + response);
					$('#canonicalLink').css('border-color', '#FF0000');
				}
		   });
	}
	
	function commentsPostSave() {
		
		console.log("### Comments Post Save Triggered ###");
		$("#premoderation_hid").val('false');
		$("#pre-comments-moderation").prop("checked", false);
		console.log("### Comments Post Save Triggered ###  " + $("#premoderation_hid").val());
		


	}
	function commentsPreSave() {
		console.log("### Comments Pre Save Triggered ###");
		$("#premoderation_hid").val('true');
		$("#post-comments-moderation").prop("checked", false);
		console.log("### Comments Pre Save Triggered ###  " + $("#premoderation_hid").val());
	}
	
	function generateexpiredate(control) {
		//moment.locale('en-GB');
		var now = new moment();
		now.locale('en-GB');
		console.log ( "### Current Date is ###  "+  now.format("dd/MM/YYYY HH:mm"));

		$("#" + control).val(now.format("DD/MM/YYYY HH:mm"));
	}