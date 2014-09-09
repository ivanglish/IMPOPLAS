<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
	<title>Crear Cotizacion</title>
	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
</head>
	<body>
	
		<jsp:include page="header.jsp" />
		
		<div class="form-group" style="margin-top:65px;">
			<form action="/IMPOPLAS/buscaCliente" >
			<div class="input-append">
			  <i class="icon-zoom-in"></i>
			        <input name="rutBuscar" data-provide="typeahead" data-items="4"  type="text" 
			           class="span2 search-query">
			        <button type="submit" class="btn">Buscar Rut</button>
			    </div>
			</form>
		
		</div>
		
		<div class="form-group">
			<form:form class="form-horizontal" method="POST" commandName ="clienteModel" action="/IMPOPLAS/saveCliente">
				<h2>Crear Cotizacion</h2>
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
						<button type="submit" class="btn btn-primary">Guardar Cliente</button>
					</div>
				</div>
				<label title="${estado}"></label>
			</form:form>
			
		    <div class="container">
			    <div class="row feature">
			        <div class="col-xs-12 col-sm-4 cfeature infos">
			            <a href="<c:url value="/addCliente"/>">Cantidad</a>
			        </div>
			        <div class="col-xs-12 col-sm-4 cfeature free">
			            <a href="<c:url value="/crearCotizacion"/>">Detalle</a>
			        </div>
			        <div class="col-xs-12 col-sm-4 cfeature standard">
			            <a href="<c:url value="/addCliente"/>">Precio</a>
			        </div>
			        
			        <div class="col-xs-12 col-sm-4 cfeature standard">
			            <a href="<c:url value="/addCliente"/>">Total</a>
			        </div>
			    </div>
			</div>
			
			<form:form class="form-horizontal" method="POST" modelAttribute ="detalleModel" action="/IMPOPLAS/addProduct">
				<h2>Crear Cotizacion</h2>
				<div class="form-group">
						<label class="col-sm-2 control-label">Product:</label>
						<div class="col-sm-9">
							<form:input path="medioPago" type="text" required="true"></form:input>
						</div>
				</div>
				<div class="form-group">
						<label class="col-sm-2 control-label">Cantidad</label>
						<div class="col-sm-9">
							<form:input path="observacion" type="text" ></form:input>
						</div>
				</div>

				
			</form:form>
			
		</div>
	</body>
</html>