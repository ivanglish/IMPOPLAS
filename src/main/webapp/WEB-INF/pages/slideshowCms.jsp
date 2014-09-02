<!doctype html>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Nisum CMS</title>
    
    	<style type="text/css">
			.slideshow { height: 232px; width: 232px; margin: auto }
			.slideshow img { padding: 15px; border: 1px solid #ccc; background-color: #eee; }
		</style>
	  	<link href="<c:url value="/resources/css/slideshow.css"/>" rel="stylesheet">
		<script src="<c:url value="/resources/js/jquery-2.0.3.min.js"/>" type="text/javascript"></script>
		
		<!-- include Cycle plugins -->
		<script type="text/javascript" src="http://malsup.github.com/jquery.cycle.all.js"></script>
		<script src="<c:url value="/resources/js/jquery.easing.1.3.js"/>" type="text/javascript"></script>		
		<script src="<c:url value="/resources/bootstrap-3.0.3/js/bootstrap.min.js"/>" type="text/javascript"></script>
       	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
       	<link href="<c:url value="/resources/css/cms.css"/>" rel="stylesheet">

		<script type="text/javascript">
		
        $(function() {        	 
        	
        	backColor($("#backgroundColor").val());
        	slideShow();
        });
		
        function backColor(a2){
     	   
     	   $('body').css('background-color', '#'+a2);
     	   
        } 
		
        function slideShow() {

		    $('#slideshow_1').cycle({
		        fx: 'scrollHorz',		
				easing: 'easeInOutCirc',
				speed:  700, 
				timeout: 5000, 
				pager: '.ss1_wrapper .slideshow_paging', 
		        prev: '.ss1_wrapper .slideshow_prev',
		        next: '.ss1_wrapper .slideshow_next',
				before: function(currSlideElement, nextSlideElement) {
					var data = $('.data', $(nextSlideElement)).html();
					$('.ss1_wrapper .slideshow_box .data').fadeOut(300, function(){
						$('.ss1_wrapper .slideshow_box .data').remove();
						$('<div class="data">'+data+'</div>').hide().appendTo('.ss1_wrapper .slideshow_box').fadeIn(600);
					});
				}
		    });
			
			// not using the 'pause' option. instead make the slideshow pause when the mouse is over the whole wrapper
			$('.ss1_wrapper').mouseenter(function(){
				$('#slideshow_1').cycle('pause');
		    }).mouseleave(function(){
				$('#slideshow_1').cycle('resume');
		    });
		}

		</script>   	       	
  </head>
  <body> 
	  	<div class="container" style="padding-top: 8%;">    	
	       	<div class="ss1_wrapper" style="margin-left: auto; margin-right: auto; margin-top: auto; margin-bottom: auto;">
			    <!-- our next/previous controls -->
			    <a href="#" class="slideshow_prev"><span>Previous</span></a>
			    <a href="#" class="slideshow_next"><span>Next</span></a>
	 
			    <!-- this is where our paging numbers will be generated -->    
			    <div class="slideshow_paging"></div>
			 
			    <!-- our custom box where the text of the active slide will be shown -->
			    <div class="slideshow_box">
			        <div class="data"></div>
			    </div>
			 
			    <!-- our slideshow -->
			    <a href="user" class="glyphicon glyphicon-arrow-left"> BACK..</a>
			    <div id="slideshow_1" class="slideshow">			        
	            	<c:choose>
						<c:when test="${not empty publishedArticlesSortedList}">
							<c:forEach var="item" items="${publishedArticlesSortedList}">						
								<c:choose>
										<c:when test="${item.divBackground == ''}">
											<div class="slideshow_item gradientBoxesWithOuterShadows2" style="background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, ${item.divColor}), color-stop(15%, ${item.divColor}), color-stop(100%, #D7E9F5)); background: -moz-linear-gradient(top, ${item.divColor} 0%, ${item.divColor} 55%, #D5E4F3 130%) ;">
				            					<div class="image">
				            						<div id="body${item.idarticle}">${item.body}</div>
				            					</div>
								            	<div class="data">
													<h4><a href="#">${item.title}</a></h4><p>${item.articleDescription}</p>
												</div>
											</div>
										</c:when>
										<c:otherwise>
											<div class="slideshow_item gradientBoxesWithOuterShadows2" style="background-image: url('${item.divBackground}')">
				            					<div class="image">
				            						<div id="body${item.idarticle}">${item.body}</div>
				            					</div>
								            	<div class="data">
													<h4><a href="#">${item.title}</a></h4><p>${item.articleDescription}</p>
												</div>
											</div>											
										</c:otherwise>
									</c:choose>
							</c:forEach>
						</c:when>
					</c:choose>
		    	</div>
		    	<input id="backgroundColor" type="hidden" value="${screenSettingsModel.backgroundColor}" />
		    	<a href="user" class="glyphicon glyphicon-arrow-left"> BACK..</a>
			</div> 
		</div> 
  </body>
</html>