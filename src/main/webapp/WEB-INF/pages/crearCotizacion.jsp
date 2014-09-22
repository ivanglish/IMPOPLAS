<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
    <title>Crear Cotizacion</title>
    <script src="<c:url value="/resources/js/jquery-2.0.3.min.js"/>" type="text/javascript"></script>
    <link href="<c:url value="/resources/bootstrap-3.0.3/css/bootstrap.min.css"/>" rel="stylesheet"/>
    <link href="<c:url value="/resources/css/select2.css"/>" rel="stylesheet"/>
	<script src="<c:url value="/resources/js/select2.js"/>"></script>
    <script>
		$(document).ready(function() { $("#productList").select2(); });
	</script>
</head>
    <body>
   
        <jsp:include page="header.jsp" />
       
        <div class="form-group" style="margin-top:50px;margin-left:20px;">
        	<table>
        		<tr>
        			<td>
			            <h2>Crear Cotizacion</h2>
			        </td>
			        <td>
			    </tr>
			    <tr>
			    	<td>
			    		 <form:form modelAttribute="clienteModel" action="/IMPOPLAS/buscaClienteCoti" method="GET" >
				            <div class="input-append">
				              <i class="icon-zoom-in"></i>
				                    <input name="rutBuscar" data-provide="typeahead" data-items="4"  type="text"
				                       class="span2 search-query">
				                    <button type="submit" class="btn">Buscar Rut</button>
				                    
				            </div>
			            </form:form>
			        </td>
			        <td>  
			            <form action="/IMPOPLAS/addClienteFromCoti">
			            	<button type="submit" class="btn btn-primary">Crear Nuevo Cliente</button>
			            </form>
			            <h2 style="color: green">${msg}</h2>
			        </td>
	            </tr>
            </table>
        </div>
         <div class="form-group" >
         	<c:choose>
				<c:when test="${empty clienteModel}">
					Cliente No existe 
				</c:when>
				<c:otherwise>
				<form:form commandName="clienteModel">
					<div style="text-align: center;">
					    <span">
					       <b>RUT : ${clienteModel.rut}</b>
					    </span>
					</div>
                     <table class="table" class="form-horizontal">
                          <tr>
                              <td>
                                  Razon Social: <b>${clienteModel.razonSocial}</b>
                              </td>
                              <td>
                                  Giro: <b>${clienteModel.giro}</b>
                              </td>
                              <td>
                                  Direccion: <b>${clienteModel.direccion}</b>
                              </td>
                              <td>
                                  Comuna: <b>${clienteModel.comuna}</b>
                              </td>
                          </tr>
                          <tr>
                              <td>
                                  Ciudad: <b>${clienteModel.ciudad}</b>
                              </td>
                              <td>
                                  Telefono: <b>${clienteModel.telefono}</b>
                              </td>
                              <td>
                                  Contacto: <b>${clienteModel.contacto}</b>
                              </td>
                              <td>
                                  Email: <b>${clienteModel.email}</b>
                              </td>
                          </tr>
                        </table>
                  </form:form>
                  </c:otherwise>
              </c:choose>
           </div>

       

           <form:form class="form-horizontal" method="POST" commandName ="cotizacionModel">
            <div class="container">
                <table class="table table-striped">
                      <tr>
                          <td>
                              Producto
                          </td>
                          <td>
                              Medida
                          </td>
                          <td>
                              Cantidad
                          </td>
                          <td>
                              Precio Unitario
                          </td>
                          <td>
                              Total
                          </td>
                      </tr>
                      <c:choose>
							<c:when test="${empty cotizacionModel}">
								
							</c:when>
							<c:otherwise>
			                      <c:forEach var="item" items="${cotizacionModel.productoDetalle}">
			                      	 <tr>
			                          <td>
			                              ${item.productNombre}
			                          </td>
			                          <td>
			                              ${item.productMedida}
			                          </td>
			                          <td>
			                               ${item.cantidad} 
			                          </td>
			                          <td>
			                               ${item.productPrecio} 
			                          </td>
			                          <td>
			                               ${item.subtotal} 
			                          </td>
			                      </tr>
			                      
			                      </c:forEach>
			                </c:otherwise>
			          </c:choose>
			          <tr>
                          <td>
                          </td>
                           <td>
                          </td>
                          <td>
                          </td>
                          <td>
                          	  <b>subtotal</b>
                          </td>
                          <td>
                              <b>${cotizacionModel.subtotal}</b>
                          </td>
                      </tr>
                      <tr>
                          <td>
                          </td>
                           <td>
                          </td>
                          <td>
                          </td>
                          <td>
                          	  <b>I.V.A. (19%)</b>
                          </td>
                          <td>
                              <b>${cotizacionModel.iva}</b>
                          </td>
                      </tr>
                      <tr>
                          <td>
                          </td>
                           <td>
                          </td>
                          <td>
                          </td>
                          <td>
                          	  <b>TOTAL</b>
                          </td>
                          <td>
                              <b>${cotizacionModel.total}</b>
                          </td>
                      </tr>
                </table>
            </div>
        </form:form>
            
             <!-- Changed from `hidden` to `auto`. -->
        <div style="overflow:auto;width:100%;">

            <!-- This is the div that does the trick: -->
            <div style="width:1000px;">

            <div style="display:inline-block;width:600px">
	            <form:form class="form-horizontal" method="GET" commandName="clienteModel" action="/IMPOPLAS/addProduct">
		            <table width="100%">
		            	<tr>
		            		<td>
				                <h3 style="margin-left:80px;">Agregar Productos</h3>
				            </td>
				        </tr>
		            	<tr>
		            		<td>
				               <label class="col-sm-2 control-label">Product:</label>     
		                       <select id="productList" name="productList" class="selectpicker">
										<c:choose>
											<c:when test="${not empty productModelList}">
												<c:forEach var="item" items="${productModelList}">
															<option value="${item.productCodigo},${item.productNombre},${item.productMedida},${item.productPrecio}" selected>${item.productNombre} ${item.productMedida}</option>
												</c:forEach>
											</c:when>
										</c:choose>
							   </select>
				            </td>
				        </tr>
				        <tr>
				        	<td>
				               <label class="col-sm-2 control-label">Cantidad</label>
		                        <div class="col-sm-9">
		                            <input name="cantidad" type="text" ></input>
		                            <button type="submit" class="btn">Agregar</button>
		                        </div>
				             </td>
		                </tr>
		             </table>
	            </form:form>
            </div>
            
            <div style="display:inline-block;width:100px">
            	<form:form class="form-horizontal" modelAttribute="cotizacionModel" action="/IMPOPLAS/saveCotizacion"  method="POST">
	            	<table>
	            		<tr>
	            			<td>
	            				<label class="col-sm-2 control-label">Medio de Pago</label>
	            			</td>
	            			<td>
	            				<div class="col-sm-9">
			                        <input name="medioPago" type="text" ></input>
			                    </div>
	            			</td>
	            			<td></td>
	            		</tr>
	            		<tr>
	            			<td>
	            				<label class="col-sm-2 control-label">Observacion</label>
	            			</td>
	            			<td>
	            				<div class="col-sm-9">
			                        <input name="observacion" type="text" ></input>
			                    </div>
	            			</td>
	            			<td></td>
	            		</tr>
	            		<tr>
	            			<td>
	            				<label class="col-sm-2 control-label">Vendedor</label>
	            			</td>
	            			<td>
	            				<div class="col-sm-9">
			                         <input name="vendedor" type="text" ></input>
			                     </div>
	            			</td>
	            			<td></td>
	            		</tr>
	            		<tr>
	            			<td>
	            				<label class="col-sm-2 control-label">Telefono</label>
	            			</td>
	            			<td>
	            				 <div class="col-sm-9">
			                         <input name="telefono" type="text" ></input>
			                     </div>
	            			</td>
	            			<td></td>
	            		</tr>
	            		<tr>
	            			<td>
	            				<label class="col-sm-2 control-label">Validez</label>
	            			</td>
	            			<td>
	            				<div class="col-sm-9">
			                         <input name="validez" type="text" ></input>
			                     </div>
	            			</td>
	            			<td></td>
	            		</tr>
	            		<tr>
	            			<td>
	            				<label class="col-sm-2 control-label">Correo</label>
	            			</td>
	            			<td>
	            				<div class="col-sm-9">
			                         ventas@impoplas.cl
			                     </div>
	            			</td>
	            			  <td>
					        	<button type="submit" class="btn btn-success btn-lg" style="margin-left:128px;">Crear Cotizacion</button>
					        </td>
	            		</tr>
	            	</table>
	            </form:form>
            </div>
          </div>
        </div>
    </body>
</html>