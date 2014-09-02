<!doctype html>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Nisum CMS</title>
       	<script src="<c:url value="/resources/js/jquery-2.0.3.min.js"/>" type="text/javascript"></script>
       	<script src="<c:url value="/resources/bootstrap-3.0.3/js/bootstrap.min.js"/>" type="text/javascript"></script>
       	
       	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
       	<link href="<c:url value="/resources/css/font-awesome.css"/>" rel="stylesheet">
       	<link href="<c:url value="/resources/css/cms.css"/>" rel="stylesheet">
       	<link href="<c:url value="/resources/css/gridster.css"/>" rel="stylesheet">
       	<link href="<c:url value='http://fonts.googleapis.com/css?family=Lato:100,300,400,700,900,100italic,300italic,400italic,700italic,900italic'/>" rel="stylesheet">
       	<link href="<c:url value="/resources/css/jquery-ui.css"/>" rel="stylesheet">
       	
       	<script src="<c:url value="/resources/js/jquery-ui.js"/>" type="text/javascript"></script>     	
       	<script src="<c:url value="/resources/js/jquery.gridster.js"/>" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jscolor/jscolor.js"/>" type="text/javascript"></script>
        <script>
           
	        var layout;
	        var grid_size = 100;
	        var grid_margin = 10;
	        var block_params = {
	            max_width: 6,
	            max_height: 6
	        };
	        
	        $(function(){  		
	    		
	    		grid();
	    		
	    		backColor('${screenSettingsModel.backgroundColor}');
	    		h1Color('${screenSettingsModel.headerColor}');
	    	     
	    	});
	        
	        function backColor(a2){     	   
	     	   $('body').css('background-color', '#'+a2);     	   
	        }
	        function h1Color(a2){   	   
	     	   $('h1').css('color', '#'+a2);    	   
	        } 	 	   
	        
	        var htmlVar = '<ul id="ul1" style="margin-top:60px;">';
	        var auxArticleNumber;
	                        
	       function grid() {
	            layout = $('.layouts_grid ul').gridster({
	                widget_margins: [grid_margin, grid_margin],
	                widget_base_dimensions: [grid_size, grid_size],
	                serialize_params: function($w, wgd) {
	                    return {
	                        x: wgd.col,
	                        y: wgd.row,
	                        width: wgd.size_x,
	                        height: wgd.size_y,
	                        id: $($w).attr('data-id'),
	                        name: $($w).find('.block_name').html(),
	                    };
	                },
	                min_rows: block_params.max_height
	            }).data('gridster').disable();
	        };
	        
        </script>
    </head>
    <body>  
    	<jsp:include page="header.jsp" />
		<div class="container" style="padding-bottom: 60px;">
			<div class="row-fluid">
				<div id="layouts_grid" class="layouts_grid">
					<ul id="ul1" style="margin-top: 60px;">
						<c:choose>
							<c:when test="${not empty publishedArticlesList}">
								<c:forEach var="item" items="${publishedArticlesList}">
									<c:choose>
										<c:when test="${item.divBackground == ''}">
											<li id="Article${item.idarticle}" class="layout_block gradientBoxesWithOuterShadows" 
											    data-sizey="${item.dataSizey}" data-sizex="${item.dataSizex}" 
											    data-col="${item.positionCol}" data-row="${item.positionRow}"
												style="background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, ${item.divColor}), color-stop(15%, ${item.divColor}), color-stop(100%, #D7E9F5)); background: -moz-linear-gradient(top, ${item.divColor} 0%, ${item.divColor} 55%, #D5E4F3 130%)" 
												ondblclick="modifyArticle(${item.idarticle});">
												<h1>${item.title}</h1>
												<div id="body${item.idarticle}">${item.body}</div>
											</li>
										</c:when>
										<c:otherwise>
											<li id="Article${item.idarticle}" class="layout_block gradientBoxesWithOuterShadows" 
											    data-sizey="${item.dataSizey}" data-sizex="${item.dataSizex}" 
											    data-col="${item.positionCol}" data-row="${item.positionRow}"
												style="background-image: url('${item.divBackground}')" 
												ondblclick="modifyArticle(${item.idarticle});">	
												<h1>${item.title}</h1>
												<div id="body${item.idarticle}">${item.body}</div>
											</li>											
										</c:otherwise>
									</c:choose>
								</c:forEach>
							</c:when>
						</c:choose>
					</ul>
				</div>
			</div>
		</div>
		<jsp:include page="footer.jsp" />
    </body>
</html>