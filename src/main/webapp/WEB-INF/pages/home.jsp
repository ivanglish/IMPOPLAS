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

	<div class="form-group" style="margin-top:65px;">
        <h1>SISTEMA IMPOPLAS</h1>
    </div>

    <div class="container">
	    <div class="row feature">
	        <div class="col-xs-12 col-sm-4 cfeature infos">
	            <a href="<c:url value="/addCliente"/>">Agregar Cliente</a>
	        </div>
	        <div class="col-xs-12 col-sm-4 cfeature free">
	            <a href="<c:url value="/addCliente"/>">Crear Cotizacion</a>
	        </div>
	        <div class="col-xs-12 col-sm-4 cfeature standard">
	            <a href="<c:url value="/addCliente"/>">Factura</a>
	        </div>
	    </div>
	    <div class="row feature">
	        <div class="col-xs-12 col-sm-4 cfeature infos">
	            <a href="<c:url value="/modifyCliente"/>">Modificar Cliente</a>
	        </div>
	        <div class="col-xs-12 col-sm-4 cfeature free">
	            <a href="<c:url value="/addCliente"/>">Modificar Cotizacion</a>
	        </div>
	        <div class="col-xs-12 col-sm-4 cfeature standard">
	            <a href="<c:url value="/addCliente"/>">Reporte</a>
	        </div>
	    </div>
	    <div class="row feature">
	        <div class="col-xs-12 col-sm-4 cfeature infos">
	            <a href="<c:url value="/saveCliente"/>">Consulta Cliente</a>
	        </div>
	        <div class="col-xs-12 col-sm-4 cfeature free">
	            <a href="<c:url value="/addCliente"/>">Consulta Cotizacion</a>
	        </div>
	        <div class="col-xs-12 col-sm-4 cfeature standard">
	            <a href="<c:url value="/addCliente"/>">Crear Cotizacion</a>
	        </div>
	    </div>
	      <div class="row feature">
	        <div class="col-xs-12 col-sm-4 cfeature infos">
	            <a href="<c:url value="/saveCliente"/>">Reporte Cliente</a>
	        </div>
	       <div class="col-xs-12 col-sm-4 cfeature free">
	            <a href="<c:url value="/addCliente"/>">Crear Cotizacion</a>
	        </div>
	        <div class="col-xs-12 col-sm-4 cfeature standard">
	            <a href="<c:url value="/addCliente"/>">Crear Cotizacion</a>
	        </div>
    	</div>
	</div>	
</body>