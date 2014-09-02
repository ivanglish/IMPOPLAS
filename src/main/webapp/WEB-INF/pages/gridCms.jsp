<!doctype html>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Nisum CMS Admin</title>
		<script src="<c:url value="/resources/js/jquery-2.0.3.min.js"/>" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery-ui.js"/>" type="text/javascript"></script>
		<script	src="<c:url value="/resources/bootstrap-3.0.3/js/bootstrap.min.js"/>" type="text/javascript"></script>
		
		<script	src="<c:url value="/resources/js/bootstrap-tooltip.js"/>" type="text/javascript"></script>
		<script	src="<c:url value="/resources/js/bootstrap-confirmation.js"/>" type="text/javascript"></script>
		<script	src="<c:url value="/resources/js/bootstrap-select.js"/>" type="text/javascript"></script>
		
		<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet" />
		<link href="<c:url value="/resources/css/font-awesome.css"/>" rel="stylesheet">
		<link href="<c:url value="/resources/css/cms.css"/>" rel="stylesheet">
		<link href="<c:url value="/resources/css/gridster.css"/>" rel="stylesheet">
		<link href="<c:url value='/resources/css/font-awesome.css'/>"	rel="stylesheet">
		<link href="<c:url value="/resources/css/jquery-ui.css"/>" rel="stylesheet">
		<link href="<c:url value="/resources/css/bootstrap-select.css"/>" rel="stylesheet">
		
		
		<script src="<c:url value="/resources/js/jquery.gridster.js"/>" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/gridMovement.js"/>" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/articleJS.js"/>" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jscolor/jscolor.js"/>" type="text/javascript"></script>
		
		<!-- TEST                                                       -->
		<link href="<c:url value="/resources/css/summernote.css"/>" rel="stylesheet">
		<script src="https://rawgithub.com/buckwilson/Lightbox_me/master/jquery.lightbox_me.js"></script>
		<script src="http://innovastudio.com/BootstrapLiveEditor2/scripts/innovaeditor.js"></script>
		<script src="http://innovastudio.com/BootstrapLiveEditor2/scripts/innovamanager.js"></script>
		<script src="http://innovastudio.com/BootstrapLiveEditor2/bootstrap/bootstrap_extend.css"></script>
		
		<script src="<c:url value="/resources/js/summernote.min.js"/>" type="text/javascript"></script>
		
	</head>
	<body>
		<jsp:include page="header.jsp" />
		<form id="articleAdminForm">
			<div class="row">
				<div class="col-md-2" id="leftCol">
					<ul class="nav" id="sidebar" style="position: fixed; padding-top: 60px">
						<li><a href="#sec1">Background color: <input id="backgroundColorId" class="color" value="${screenSettingsModel.backgroundColor}" onchange="backColor(this.color);" style="width:72px;"></a></li>
						<li><a href="#sec2">Header color: <input id="headerColorId" class="color" value="${screenSettingsModel.headerColor}" onchange="h1Color(this.color);" style="width:72px;margin-left: 29px;"></a></li>
						<li style="margin-left: 69px; margin-top: 10px;">
							<button type="button" class="btn btn-default btn-lg" style="position: fixed;" onclick="save();">
								<span class="glyphicon glyphicon-floppy-disk"> </span> Save layout
							</button>
						</li>
						<li style="margin-left: 69px; margin-top: 70px;">
							<button type="button" class="btn btn-default btn-lg" style="position: fixed;" onclick="addArticle();">
								<span class="glyphicon glyphicon-plus"> </span> Add Article
							</button>
						</li>
						<li style="margin-left: 69px; margin-top: 132px;">
							<button type="button" class="btn btn-default btn-lg" style="position: fixed;" onclick="addPage();">
								<span class="glyphicon glyphicon-plus"> </span> Add Page
							</button>
						</li>
						<li style="margin-left: 69px; margin-top: 232px;">
							<select id="pageList" class="selectpicker" onchange="changePageDefault();">
								<c:choose>
									<c:when test="${not empty pagesModel}">
										<c:forEach var="item" items="${pagesModel}">
											<c:choose>
												<c:when test="${item.pageDefault == 'true'}">
													<option value="${item.idPage}" selected>${item.title}</option>
												</c:when>
												<c:otherwise>
													<option value="${item.idPage}">${item.title}</option>
												</c:otherwise>
											</c:choose>
										</c:forEach>
									</c:when>
								</c:choose>
							</select>
						</li>
						<li>
							<div class="alert alert-success alert-dismissable" id="successAlert" style="margin-top: 5%; margin-left: 50px; width: 200px; display:none; position: fixed; float: left;">
								<strong>Success!</strong> Changes saved successfully.
							</div>
						</li>
						<li>
							<div class="alert alert-danger alert-dismissable"
								id="dangerAlert"
								style="margin-top: 5%; margin-left: 50px; width: 200px; display:none; position: fixed; float: left;">
								<button type="button" class="close"
									onclick="$('#dangerAlert').fadeOut('5000');">&times;</button>
								<strong>Error!</strong> The action could not be performed.
							</div>
						</li>
					</ul>
					<input id="listArticlesSize" type="hidden" value="${articlesList.size()}" />
					<input id="backgroundColor" type="hidden" value="${screenSettingsModel.backgroundColor}" />
					<input id="headerColor" type="hidden" value="${screenSettingsModel.headerColor}" />
				</div>
				<div class="col-md-8">
					<div class="container" style="padding-bottom: 60px;">
						<div class="row-fluid">
							<div id="layouts_grid" class="layouts_grid">
								<ul id="ul1" style="margin-top: 60px;">
									<c:choose>
										<c:when test="${not empty articlesList}">
											<c:forEach var="item" items="${articlesList}">
												<c:choose>
													<c:when test="${item.divBackground == ''}">
														<li id="Article${item.idarticle}" class="layout_block gradientBoxesWithOuterShadows" 
														    data-sizey="${item.dataSizey}" data-sizex="${item.dataSizex}" 
														    data-col="${item.positionCol}" data-row="${item.positionRow}"
															style="background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, ${item.divColor}), color-stop(15%, ${item.divColor}), color-stop(100%, #D7E9F5)); background: -moz-linear-gradient(top, ${item.divColor} 0%, ${item.divColor} 55%, #D5E4F3 130%)" 
															ondblclick="modifyArticle(${item.idarticle});">
													</c:when>
													<c:otherwise>
														<li id="Article${item.idarticle}" class="layout_block gradientBoxesWithOuterShadows" 
														    data-sizey="${item.dataSizey}" data-sizex="${item.dataSizex}" 
														    data-col="${item.positionCol}" data-row="${item.positionRow}"
															style="background-image: url('${item.divBackground}')" 
															ondblclick="modifyArticle(${item.idarticle});">												
													</c:otherwise>
												</c:choose>
												
													<c:choose>
														<c:when test="${item.phase == 'Publish'}">
															<span id="statusText${item.idarticle}" style="left:10px;color:green;">Published</span>
														</c:when>
														<c:when test="${item.phase == 'Draft'}">
															<span id="statusText${item.idarticle}" style="left:10px;color:red;">Draft</span>
														</c:when>
													</c:choose>	
													
													<a class="close" type="button" data-placement="bottom" data-toggle="modal" data-target="#confirmationModal" onclick="changeConfirmationAction(${item.idarticle})">X</a>
													
													<h1 id="title${item.idarticle}">${item.title}</h1>
													<div id="body${item.idarticle}">${item.body}</div>
													<input id="desc${item.idarticle}" value="${item.articleDescription}" type="hidden" />
													<input id="status${item.idarticle}" value="${item.phase}" type="hidden" />
													<input id="divColorHidden${item.idarticle}" value="${item.divColor}" type="hidden" />
													<input id="divBackgroundHidden${item.idarticle}" value="${item.divBackground}" type="hidden" />
												</li>
											</c:forEach>
										</c:when>
									</c:choose>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-2" id="rightCol">
					
				</div>
			</div>
		</form>
		<jsp:include page="footer.jsp" />
		
		<!-- INCLUDE THIS SECTION FOR USING MODAL DIALOG -->
		<div id="modalEditor" class="modal fade in gradientBoxesWithOuterShadows"  tabindex="-1" role="dialog" aria-labelledby="modalEditorLabel" aria-hidden="true" style="height:710px; width:900px;">
			<div class="modal-header">
		      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>
		      <c:set var="saveOrUpdateTitle"  value="$('#saveOrUpdateId').val()"/>
		      <h3 id="myModalLabel"></h3>
		    </div>
		    <div class="modal-body">
		    	<div class="row-fluid">
					<div class="span6">
						<table>
							<tr>
								<td>
									<h4>Title</h4>
								</td>
								<td>
									<p><input id="articleTitleBox" class="span12" type="text" placeholder="title"></p>
								</td>
								<td>
									<h4>Status:</h4>
								</td>
								<td>
									<span id="status"></span>
								</td>
							</tr>
							<tr>
								<td>
									<h4>Description</h4>
								</td>	
								<td>
									<textarea id="articleDescBox" class="span6" rows="1" placeholder="Description" style="width: 519px;"></textarea>
								</td>
							</tr>
							<tr>
								<td>
									<h4>Article color</h4>
								</td>
								<td>
									<a href="#sec3"><input id="divColorId" class="color" value="$('#Article'+$('#saveOrUpdateId').val()).css('background-color')" onchange="divColor(this.color, $('#saveOrUpdateId').val());" style="margin-left: 36px;"></a>
								</td>
							</tr>
							<tr>
								<td>
									<h4>Article background</h4>
								</td>
								<td>
									<input id="uploadBox" type="file" name="uploadBox" />
									<button id="upload" value="Upload" onclick="sendBackgroundImage()">Upload</button>
								</td>
							</tr>
						</table>
					</div>
				</div>	
		        <div id="divEditor"></div>
			    <table>
			    	<tr>
			    		<td width="91%">
			    			<input id="draft" type="radio" name="phase" value="Draft">Draft<br>
							<input id="publish" type="radio" name="phase" value="Publish">Publish
			    		</td>
			    		<td>
			    			 <button class="btn btn-primary" onclick="saveNewArticle()"> &nbsp; Save &nbsp; </button>
			    		</td>
			    	</tr>
			    </table>
		     </div>   
			 <input id="saveOrUpdateId" type="hidden" value="" />
			 <input id="backgroundURL" type="hidden" value="" />
		</div>
		<!-- /INCLUDE THIS SECTION FOR USING MODAL DIALOG -->
		
		<!-- INCLUDE THIS SECTION FOR USING MODAL DIALOG -->
		<div id="modalEditorNewPage" class="modal fade in gradientBoxesWithOuterShadows"  tabindex="-1" role="dialog" aria-labelledby="modalEditorLabel" aria-hidden="true" style="height:210px; width:400px;">
			<div class="modal-header">
		      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>
		      <h3>New Page</h3>
		    </div>
		    <div class="modal-body">
		    	<div class="row-fluid">
					<div class="span6">
						<table>
							<tr>
								<td>
									<h4>Title</h4>
								</td>
								<td>
									<p><input id="pageBox" class="span12" type="text" placeholder="page title"></p>
								</td>
								<td>
									<button class="btn btn-primary" onclick="saveNewPage()"> &nbsp; Save &nbsp; </button>
								</td>
								
							</tr>
						</table>
					</div>
				</div>	
		     </div>   
		</div>
		<!-- /INCLUDE THIS SECTION FOR USING MODAL DIALOG -->


		<!-- MODAL WINDOW ALERT FOR CONFIRMATION ON DELETE -->
		<div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		  <div class="modal-dialog">
		    <div class="modal-content">
		      <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		        <h4 class="modal-title" id="myModalLabel">Deleting article</h4>
		      </div>
		      <div class="modal-body">
				Are you sure?
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
		        <button id="confirmationButtonContinue" type="button" class="btn btn-primary">Continue</button>
		      </div>
		    </div>
		  </div>
		</div>

	</body>
</html>