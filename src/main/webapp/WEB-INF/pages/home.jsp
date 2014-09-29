<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
	<title>home</title>
	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
	
	<style>

    .cfeature {
        padding:10px;
        font-weight:bold;
    }

    .feature {                
        margin-bottom: 3px;        
    }
    
    .infos {
        background: #CDD8C9;
    }
    
    .free {
        background: #DFF0D8;
    }
   
    .standard {
        background: #D9EDF7;
    }        
       
</style>

</head>

<body>

<jsp:include page="header.jsp" />

	<div class="form-group" style="margin-top:65px;margin-left:65px;">
        <h1>SISTEMA IMPOPLAS</h1>
    </div>

    <div class="container">    
    	<c:forEach var="item" items="${userModel.rol.permisos}" varStatus="theCount">
    	
    		 <c:if test="${theCount.count % 3 == 1 || theCount.count == 1}">
   				<div class="row feature">
   			 </c:if>
   			    <c:if test="${(theCount.count ==1) || (theCount.count ==4) || (theCount.count ==7) || (theCount.count ==10) || (theCount.count ==13) || (theCount.count ==16)}">
			        <div class="col-xs-12 col-sm-4 cfeature infos">
			            <a href="<c:url value="${item.url}"/>">${item.permiso}</a>
			        </div>
			    </c:if>
			     <c:if test="${(theCount.count ==2) || (theCount.count ==5) || (theCount.count ==8) || (theCount.count ==11) || (theCount.count ==14) || (theCount.count ==17)}">
			        <div class="col-xs-12 col-sm-4 cfeature free">
		            	<a href="<c:url value="${item.url}"/>">${item.permiso}</a>
			        </div>
			    </c:if>
			      <c:if test="${(theCount.count ==3) || (theCount.count ==6) || (theCount.count ==9) || (theCount.count ==12) || (theCount.count ==15) || (theCount.count ==18)}">
			        <div class="col-xs-12 col-sm-4 cfeature standard">
			            <a href="<c:url value="${item.url}"/>">${item.permiso}</a>
			        </div>
			     </c:if>
			<c:if test="${theCount.count % 3 == 0}">
		    	</div>
		    </c:if>
	    </c:forEach>
	</div>	
</body>