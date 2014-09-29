<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
	<title>Stock</title>
	<script src="<c:url value="/resources/js/jquery-2.0.3.min.js"/>" type="text/javascript"></script>
	<link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
	<link href="<c:url value="/resources/css/select2.css"/>" rel="stylesheet"/>
	<script src="<c:url value="/resources/js/select2.js"/>"></script>
    
</head>
    <script>
		$(document).ready(function() { $("#productList").select2(); });
	</script>

<body>

		<jsp:include page="header.jsp" />
        
        <form class="form-inline search-form" action="/IMPOPLAS/consultarStockByProduct"  style="margin-top:100px;">
			<div class="form-group">
			<label class="control-label hidden-xs" for="codigo">Código de Producto</label>
			</div>
			<div class="form-group">
			<input id="codigo" name="codigo" class="form-control" type="text" placeholder="Ingrese Código">
			</div>
			 <select id="productList" name="productList" class="selectpicker" width="80px;">
			 		<option value="0" selectd>-- Elija un producto --</option>
					<c:choose>
						<c:when test="${not empty productModelList}">
							<c:forEach var="item" items="${productModelList}">
										<option value="${item.productCodigo}">${item.productNombre} ${item.productMedida}</option>
							</c:forEach>
						</c:when>
					</c:choose>
		    </select>
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