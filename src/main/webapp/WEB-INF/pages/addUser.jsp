<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
	<title>Agregar Usuario</title>
	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
</head>
	<body>
	
		<jsp:include page="header.jsp" />
		<div class="form-group" style="margin-top:65px;">
			<form:form class="form-horizontal" method="POST" modelAttribute="userModel" action="/IMPOPLAS/saveUser">
				<h2>Agregar Usuario</h2>
				<div class="form-group">
						<label class="col-sm-2 control-label">Nombre:</label>
						<div class="col-sm-9">
							<form:input path="nombre" type="text" required="true"></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Password:</label>
						<div class="col-sm-9">
							<form:input path="password" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Activo:</label>
						<div class="col-sm-9">
							<form:input path="activo" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Rol:</label>
						<div class="col-sm-9">
							<form:input path="rol" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
					<div class="col-sm-offset-2 col-sm-3">
							<button name="from" type="submit" class="btn btn-primary">Guardar User</button>
					</div>
				</div>
				<label title="${estado}"></label>
			</form:form>
		</div>
	</body>
</html>