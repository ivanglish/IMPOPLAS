<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
	<title>home</title>
	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
	
</head>

<body>

		<jsp:include page="header.jsp" />
        
        <form class="form-inline search-form" action="/IMPOPLAS/consultarStockByProduct"  style="margin-top:100px;">
			<div class="form-group">
			<label class="control-label hidden-xs" for="codigo">Código de Producto</label>
			</div>
			<div class="form-group">
			<input id="codigo" name="codigo" class="form-control" type="text" placeholder="Ingrese Código" required="required">
			</div>
			<button id="btnSearch" class="btn btn-primary buscar" type="submit">Buscar</button>
			<!--button id="btnAdvanceSearch" class="btn btn-default buscar" type="button">Busqueda Avanzada</button-->
		</form>
			<div id="ResultsDisplay">
				<div class="row">
					<div class="col-md-6">
						<h3>Datos del Producto</h3>
						<div id="info-producto">
						
						 <c:choose>
							<c:when test="${empty stockModel}">
								
							</c:when>
							<c:otherwise>
			                      <c:forEach var="item" items="${stockModel}">    
										<table class="table table-bordered">
										<tbody>
										<tr>
										<th>Nombre</th>
										<td>${item.product.productNombre}</td>
										</tr>
										<tr>
										<th>Medida</th>
										<td>${item.product.productMedida}</td>
										</tr>
										<tr>
										<th>Bodega</th>
										<td>${item.bodega.nombre}</td>
										</tr>
										<tr>
										<th>Cantidad</th>
										<td>${item.cantidad}</td>
										</tr>
										<tr id="precio_promedio" class="active" style="display: none;">
										<th>Costo Promedio</th>
										<td>${item.product.productPrecio}</td>
										</tr>
										</tbody>
										</table>
								</c:forEach>
							</c:otherwise>
						</c:choose>
					</div>

				</div>
				<div class="col-md-5 col-md-offset-1">
					<h3>Valores de Venta</h3>
					<table class="table table-bordered">
						<tbody id="info-ventas"><H1>$ ${stockModel[0].product.productPrecio}</H1></tbody>
					</table>
				</div>
				<div class="col-sm-12 gral-info">
					<H3>CANTIDAD TOTAL: ${cantidadTotal}</H3>
				</div>
			</div>
		</div>
</body>
</html>