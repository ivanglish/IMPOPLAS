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
            <form:form modelAttribute="clienteModel" action="/IMPOPLAS/buscaClienteCoti" method="GET" >
	            <div class="input-append">
	              <i class="icon-zoom-in"></i>
	                    <input name="rutBuscar" data-provide="typeahead" data-items="4"  type="text"
	                       class="span2 search-query">
	                    <button type="submit" class="btn">Buscar Rut</button>
	                    
	            </div>
            </form:form>
            <form action="/IMPOPLAS/addCliente">
            	<button type="submit" class="btn btn-primary">Crear Nuevo Cliente</button>
            </form>
        </div>
         <div class="form-group" >
         	<c:choose>
				<c:when test="${empty clienteModel}">
					Cliente No existe 
				</c:when>
				<c:otherwise>
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
                  </c:otherwise>
              </c:choose>
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