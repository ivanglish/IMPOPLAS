<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
	<title>Agregar Cliente</title>
	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
</head>
	<body>
	
		<jsp:include page="header.jsp" />
		<div class="form-group" style="margin-top:65px;">
			<form:form class="form-horizontal" method="POST" modelAttribute="clienteModel" action="/IMPOPLAS/saveCliente">
				<h2>Agregar Cliente</h2>
				<div class="form-group">
						<label class="col-sm-2 control-label">Rut:</label>
						<div class="col-sm-9">
							<form:input path="rut" type="text" required="true"></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Razon Social</label>
						<div class="col-sm-9">
							<form:input path="razonSocial" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Giro:</label>
						<div class="col-sm-9">
							<form:input path="giro" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Direccion:</label>
						<div class="col-sm-9">
							<form:input path="direccion" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Comuna:</label>
						<div class="col-sm-9">
							<form:input path="comuna" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Ciudad:</label>
						<div class="col-sm-9">
							<form:input path="ciudad" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Telefono:</label>
						<div class="col-sm-9">
							<form:input path="telefono" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Contacto:</label>
						<div class="col-sm-9">
							<form:input path="contacto" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Email:</label>
						<div class="col-sm-9">
							<form:input path="email" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
					<div class="col-sm-offset-2 col-sm-3">
						<c:choose>
							<c:when test="${fromCoti==1}">
								<button name="from" value="fromCoti" type="submit" class="btn btn-success">Guardar Cliente</button>
							</c:when>
							<c:otherwise>
								<button name="from" type="submit" class="btn btn-primary">Guardar Cliente</button>
							</c:otherwise>
						</c:choose>
					</div>
				</div>
				<label title="${estado}"></label>
			</form:form>
		</div>
	</body>
</html>