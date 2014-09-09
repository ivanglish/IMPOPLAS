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
		
		<div class="form-group" style="margin-top:65px;margin-left:20px;">
			<h2>Crear Cotizacion</h2>
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
			<table class="table">
  					<tr>
  						<td>
  							Razon Social
  						</td>
  						<td>
  							Giro
  						</td>
  						<td>
  							Direccion
  						</td>
  						<td>
  							Comuna
  						</td>
  					</tr>
  					<tr>
  						<td>
  							Ciudad
  						</td>
  						<td>
  							Telefono
  						</td>
  						<td>
  							Contacto
  						</td>
  						<td>
  							Email
  						</td>
  					</tr>
				</table> 
			</div>
			
		    <div class="container">
		    	<table class="table">
  					<tr>
  						<td>
  							Producto
  						</td>
  						<td>
  							Cantidad
  						</td>
  						<td>
  							Subtotal
  						</td>
  						<td>
  							Total
  						</td>
  					</tr>
				</table> 
			</div>
			
			<form:form class="form-horizontal" method="POST" modelAttribute ="detalleModel" action="/IMPOPLAS/addProduct">
				<h3>Agregar Productos</h3>
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
	</body>
</html>