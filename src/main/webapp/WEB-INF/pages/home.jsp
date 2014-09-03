<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
	<title>payasote!!</title>
	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
</head>

<body>

<jsp:include page="header.jsp" />

	<div class="form-group" style="margin-top:65px;">
        <h1>SISTEMA IMPOPLAS</h1>
    </div>
	<div class="form-group">
        <a href="<c:url value="/addCliente"/>">Agregar Cliente</a>
    </div>
    <div class="form-group">
        <a href="<c:url value="/saveCliente"/>">testing save Cliente</a>
    </div>
		
		
</body>