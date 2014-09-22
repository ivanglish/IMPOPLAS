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

		 <div class="modal fade" id="myPopover" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		          <div class="modal-dialog">
		            <div class="modal-content">
		              <div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
			        <h4 class="modal-title" id="H1">Buscar productos.</h4>
		                  <section class="col-lg-5xx">
		                      <label>Nombre</label>
		                  <input class="form-control" type="text" id="nombre_buscar" placeholder="Buscar por nombre..."  autocomplete="off">
		                  </section>
		                  <section class="col-lg-5xx">
		                    <label>Marca</label>
		                    <input class="form-control" type="text" id="marca" placeholder="Buscar por marca..." autocomplete="off">
		                  </section>
		              </div>
		              <div class="modal-body">
		               <span id="myPopoverError">
		               </span>
		                  <script id="advanceResultTmpl" type="text/x-jquery-tmpl">
                  <a class="list-group-item" href="javascript:;" onclick="copyTo('${sku}')">${sku} - ${nombre} (${marca})</a>
                  </script>
		                  <div class="list-group tt-dropdown-result" id="advanceResult">
		                  </div>
		              </div>
		              <div class="modal-footer">
		                    <button type="button" class="btn btn-primary" id="btnAdvanceSearchResult">Buscar</button>
			                <button type="button" class="btn btn-default"  data-dismiss="modal">Cancelar</button>
		              </div>
		            </div><!-- /.modal-content -->
		          </div><!-- /.modal-dialog -->
		        </div><!-- /.modal -->
		        
        
        
        
        <form class="form-inline search-form" role="form" onsubmit="return false" action="#" accept-charset="UTF-8" style="margin-top:100px;">
			<div class="form-group">
			<label class="control-label hidden-xs" for="codigo">Código de Producto</label>
			</div>
			<div class="form-group">
			<input id="codigo" class="form-control" type="text" placeholder="Ingrese Código" required="required">
			</div>
			<button id="btnSearch" class="btn btn-primary buscar" type="button">Buscar</button>
			<button id="btnAdvanceSearch" class="btn btn-default buscar" type="button">Busqueda Avanzada</button>
			<div class="form-group col-sm-offset-1">
			<span id="productName">TEE 90º PE100 SDR17 T.F 63mm</span>
			</div>
		</form>
			<div id="ResultsDisplay">
				<div class="row">
					<div class="col-md-6">
						<h3>Datos del Producto</h3>
						<div id="info-producto">
							<table class="table table-bordered">
							<tbody>
							<tr>
							<th>Código Imp.</th>
							<td>235043</td>
							</tr>
							<tr>
							<th>Hiper Familia</th>
							<td>VENTAS</td>
							</tr>
							<tr>
							<th>Familia</th>
							<td>TUBERIA Y FITTINGS</td>
							</tr>
							<tr>
							<th>Sub Familia</th>
							<td>HDPE</td>
							</tr>
							<tr>
							<th>Marca</th>
							<td>PLASTITALIA</td>
							</tr>
							<tr id="precio_promedio" class="active" style="display: none;">
							<th>Costo Promedio</th>
							<td>$ 1.644,97</td>
							</tr>
							</tbody>
							</table>
					</div>

				</div>
				<div class="col-md-5 col-md-offset-1">
					<h3>Valores de Venta</h3>
					<table class="table table-bordered">
						<tbody id="info-ventas"></tbody>
					</table>
				</div>
				<div class="col-sm-12 gral-info">
				</div>
			</div>
		</div>
</body>
</html>