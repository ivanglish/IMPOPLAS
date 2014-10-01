<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
	<title>Agregar Producto</title>
	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
</head>
	<body>
	
		<jsp:include page="header.jsp" />
		<div class="form-group" style="margin-top:65px;">
			<form:form class="form-horizontal" method="POST" modelAttribute="productModel" action="/IMPOPLAS/saveProducto">
				<h2>Agregar Producto</h2>
				<div class="form-group">
						<label class="col-sm-2 control-label">Codigo:</label>
						<div class="col-sm-9">
							<form:input path="productCodigo" type="text" required="true"></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Nombre:</label>
						<div class="col-sm-9">
							<form:input path="productNombre" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Medida:</label>
						<div class="col-sm-9">
							<form:input path="productMedida" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Precio:</label>
						<div class="col-sm-9">
							<form:input path="productPrecio" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Familia:</label>
						<div class="col-sm-9">
							<form:input path="productFamilia" type="text" ></form:input>
						</div>
				</div>
				<div class="form-group">
					<div class="col-sm-offset-2 col-sm-3">
							<button name="from" type="submit" class="btn btn-primary">Guardar Producto</button>
					</div>
				</div>
				<label title="${estado}"></label>
			</form:form>
		</div>
	</body>
</html>