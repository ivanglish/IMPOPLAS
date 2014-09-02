	var selectedPage;

	$(function(){
		
		$('#divEditor').summernote({
			  height: 300,   //set editable area's height
			  focus: true,    //set focus editable area after Initialize summernote
			  
			  toolbar: [
			            ['style', ['style']],
			            ['style', ['bold', 'italic', 'underline', 'clear']],
			            ['fontsize', ['fontsize']],
			            ['color', ['color']],
			            ['para', ['ol', 'paragraph']],
			            ['height', ['height']],
			            ['table', ['table']],
			            ['insert', ['picture', 'link','video']],
			            ['codeview',['codeview']]
			            
			          ],
			  
			  onImageUpload: function(files, editor, welEditable) {
		            sendFile(files[0],editor,welEditable);
		        }
			});			
		
		backColor($("#backgroundColor").val());
		h1Color($("#headerColor").val());
		
		selectedPage = +$('#pageList').val();

	});
    
    function backColor(a2){    	   
 	   $('body').css('background-color', '#'+a2);
    } 
    
	function h1Color(a2){   	   
 	   $('h1').css('color', '#'+a2);    	   
    } 
	
	function divColor(a2, id){
		$('#Article'+id).css( 'background' , '-moz-linear-gradient(top, #'+a2.valueElement.value+' 0%, #'+a2.valueElement.value+' 55%, #D5E4F3 130%)');
			
	}
   
            	     
	function save() {	        	
	        	
	        	var listData =JSON.stringify(getArticlesPositonToSave());
	        	var screenData =JSON.stringify(getScreenSettingToSave());
	        	
	        	$.ajax({ type: "POST",   
	   		         url: "updateContent/",   
	   		         cache: false ,
	   		         data:'listArticles=' + listData + '&screenData=' + screenData,
	   		 		 success: function(response){
	   		 			$('#successAlert').fadeIn('slow');
	   		 			setTimeout(function(){ $('#successAlert').fadeOut(); }, 2000);
	   		 			
	   		 		 },
	   		 		 error: function(){						
	   		 			$('#dangerAlert').fadeIn('slow');
	   		 		setTimeout(function(){ $('#dangerAlert').fadeOut(); }, 2000);
	   		 		 }
	   				});	
	        }
	
	function getArticlesPositonToSave(){		
		var listArticles = new Array();
    	var article=new Object();
    	for(var i = 0; i < $("#listArticlesSize").val(); i++){
    		var articlesArray = $('[id^="Article"]');
    		idArticle = "#"+articlesArray[i].id;
        	article=new Object();
        	article.idarticle=idArticle.substring(8);
        	article.positionCol=$(idArticle).attr("data-col");
        	article.positionRow=$(idArticle).attr("data-row");
        	article.dataSizex=$(idArticle).attr("data-sizex");
        	article.dataSizey=$(idArticle).attr("data-sizey");
        	listArticles[i] = article;    		
      	}
    	return listArticles;	
	}
	
	function getScreenSettingToSave(){
		var screenSetting=new Object();  	
    	screenSetting.idscreenSettings=1;
    	screenSetting.backgroundColor=$("#backgroundColorId").val();
    	screenSetting.headerColor=$("#headerColorId").val();
    	return screenSetting;
		
	}
	
	function sendFile(file,editor,welEditable) {
	    data = new FormData();
	    data.append("file", file);
	    $.ajax({
	        data: data,
	        type: "POST",
	        url: "saveImage/",
	        cache: false,
	        contentType: false,
	        processData: false,
	        success: function(url) {
	                editor.insertImage(welEditable, url);
	        }
	    });
	}
	
	
	function sendBackgroundImage(){
		
		 var file_data = $("#uploadBox").prop("files")[0]; // Getting the properties of file from file field
		 var form_data = new FormData(); // Creating object of FormData class
		 form_data.append("file", file_data); // Appending parameter named file with properties of file_field to form_data
		 $.ajax({
			 data: form_data, // Setting the data attribute of ajax with file_data
			 type: 'POST',
			 url: "saveImage/",
			 cache: false,
			 contentType: false,
			 processData: false,
			 success: function(response){
				 	$("#backgroundURL").val(response);
				 	alert('Background imange has been uploaded sucessfully');
		 		 },
		 		 error: function(){						
		 			 alert('The image could not be uploaded');
		 		 }
			 });
	}
	
	function saveNewArticle() {
		
		if ($('#articleTitleBox').val()==""){
			
			alert("the title cannot be empty");
			return false;
		}
		
		var articleData = new Object();
		articleData.idarticle = $('#saveOrUpdateId').val();
		articleData.title = $('#articleTitleBox').val();
		articleData.articleDescription = $('#articleDescBox').val();
		if ($('#saveOrUpdateId').val()==0){
			articleData.body = $('#divEditor').code();	
			articleData.divBackground = $("#backgroundURL").val();
		}else{
			articleData.body = stripContent($('#saveOrUpdateId').val() ,$('#divEditor').code());
			if ($('#divBackgroundHidden'+$('#saveOrUpdateId').val()).val()!=""){
				articleData.divBackground = $('#divBackgroundHidden'+$('#saveOrUpdateId').val()).val();
			}else{
				articleData.divBackground = $("#backgroundURL").val();
			}
		}		
		articleData.body = articleData.body.replace(/&nbsp;/g, ' ');
		
		var heightContent=$(".note-editable")[0].scrollHeight+90;

		if ($("#draft").is(':checked'))
			articleData.phase = $("#draft").val();
		if ($("#publish").is(':checked'))
			articleData.phase = $("#publish").val();
		
		if ( $("#divColorId").val().indexOf("#")==-1){
			articleData.divColor = "#"+$("#divColorId").val();
		}else{
			articleData.divColor = $("#divColorId").val();
		}
		 
		var data = JSON.stringify(articleData);
		
		$.ajax({ type: "POST",   
		         url: "saveNewArticle/",   
		         cache: false ,
		         dataType : "text",
		         data:'articleObject=' + data +'&currentPage='+$('#pageList').val()+"&heightContent="+heightContent,
		 		 success: function(response){
		 			$('#successAlert').fadeIn('slow');
		 			setTimeout(function(){ $('#successAlert').fadeOut(); }, 2000);
		 		 	$('#modalEditor').trigger('close');
		 		 	
	 		 		if(articleData.phase == "Publish"){
	 		 			$("#statusText"+$('#saveOrUpdateId').val()).text("Published");
	 		 			$("#statusText"+$('#saveOrUpdateId').val()).css("color", "green");
	 		 		}else{
	 		 			$("#statusText"+$('#saveOrUpdateId').val()).text("Draft");
	 		 			$("#statusText"+$('#saveOrUpdateId').val()).css("color", "red");
	 		 		}
		 		 	
	 		 		$("#articleAdminForm").submit();			
		 		 },
		 		 error: function(){						
		 			$('#dangerAlert').fadeIn('slow');
		 		setTimeout(function(){ $('#dangerAlert').fadeOut(); }, 2000);
		 		 }
				});		       
    }
    
	function addArticle(){
		
		$('#saveOrUpdateId').val(0);
		$('#divEditor').code("");
		$('#articleTitleBox').val("");
		$('#articleDescBox').val("");
		$('#status').text("New");
		$("#publish").prop("checked", true);
		$('#myModalLabel').text("Add Article");
		$("#divColorId").val("#FFFFFF");
		$('#modalEditor').lightbox_me({		
			centered: true,
		});	
	}
	
			
	function modifyArticle(id){
			
		$('#saveOrUpdateId').val(id);
		$('#divEditor').code($("#body"+id));
		$('#articleTitleBox').val($("#title"+id).text());
		$('#articleDescBox').val($("#desc"+id).val());
		$('#status').text($("#status"+id).val());
		$('#divColorId').val($("#divColorHidden"+id).val());
		$('#divColorId').css('background-color', $("#divColorHidden"+id).val());
		if ($("#status"+id).val() == "Draft"){
			$("#draft").prop("checked", true);
		}
		if ($("#status"+id).val() == "Publish"){
			$("#publish").prop("checked", true);
		}
		$('#myModalLabel').text("Modify Article");
		$('#modalEditor').lightbox_me({		
			centered: true,
		});
	}
	
	function deleteArticle(id){

		$.ajax({ type: "POST",   
	         url: "deleteArticle/",   
	         cache: false ,
	         data:'idArt='+id,
	 		 success: function(response){
	 			$('#successAlert').fadeIn('slow');
	 			setTimeout(function(){ $('#successAlert').fadeOut(); }, 2000);
	 			$("#articleAdminForm").submit();
	 			
	 		 },
	 		 error: function(){						
	 			$('#dangerAlert').fadeIn('slow');
	 		setTimeout(function(){ $('#dangerAlert').fadeOut(); }, 2000);
	 		 }
			});		  	
	}
	
	function addPage(){
		
		$('#modalEditorNewPage').lightbox_me({		
			centered: true,
		});	
	}
	
	function saveNewPage(){
		
		if ($('#pageBox').val()==""){
			
			alert("the title cannot be empty");
			return false;
		}else{
			
			$.ajax({ type: "POST",   
		         url: "savePage/",   
		         cache: false ,
		         data:'title='+$('#pageBox').val(),
		 		 success: function(response){
		 			$('#successAlert').fadeIn('slow');
		 			setTimeout(function(){ $('#successAlert').fadeOut(); }, 2000);
		 			$("#articleAdminForm").submit();
		 			
		 		 },
		 		 error: function(){						
		 			$('#dangerAlert').fadeIn('slow');
		 		setTimeout(function(){ $('#dangerAlert').fadeOut(); }, 2000);
		 		 }
				});		 
			
		}
		
		
	}
	
	function changePageDefault(){
		$.ajax({ type: "POST",   
	         url: "setPage/",   
	         cache: false ,
	         data:'currentPage='+$('#pageList').val()+'&oldPage='+selectedPage,
	 		 success: function(response){
	 			$("#articleAdminForm").submit();
	 			
	 		 },
	 		 error: function(){						
	 		 }
		});		  
	}
	
	function changeConfirmationAction(id) {
		$('#confirmationButtonContinue').unbind('click');
		$("#confirmationButtonContinue").click(function() {deleteArticle(id);});
	}
	
	function stripContent(id,content){
		
		var piece= content.split('<div id="body'+id+'">');
		if (piece[1]==undefined) return content;
		return piece[1].substring(0, piece[1].length -6);

	}