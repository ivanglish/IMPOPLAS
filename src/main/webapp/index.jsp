<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
	<title>Impoplas</title>
	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
</head>
	<body>
		
		
		
		<form class="col-md-12" method="GET" action="/IMPOPLAS/login">
		 		<div class="form-group">
			        <h1>IMPOPLAS SYSTEM</h1>
			    </div>
			    <div class="form-group">
			        <input name="usuario" value="payasote" type="text" class="form-control input-lg" placeholder="Usuario">
			    </div>
			    <div class="form-group">
			        <input name="password" value="payasote" type="password" class="form-control input-lg" placeholder="Contraseña">
			    </div>
			    <div class="form-group">
			        <button class="btn btn-primary btn-lg btn-block">Entrar</button>
			    </div>
		</form>

	</body>
</html>