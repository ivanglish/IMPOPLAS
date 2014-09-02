<!doctype html>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html class="no-js" lang="en">
<head>
	<title>Impoplas</title>
</head>
	<body>
		<h2>AGREGAR CLIENTE</h2>
		<form:form method="POST" modelAttribute="clienteModel" action="/IMPOPLAS/saveCliente">
			<div>
				<table>
					<tr>
						<td>
							<label>Rut:</label>
						</td>
						<td>
							<form:input path="rut" type="text" required="true"></form:input>
						</td>
					</tr>
					<tr>
						<td>
							<label>Razon Social</label>
						</td>
						<td>
							<form:input path="razonSocial" type="text" ></form:input>
						</td>
					</tr>
					<tr>
						<td>
							<label>Giro:</label>
						</td>
						<td>
							<form:input path="giro" type="text" ></form:input>
						</td>
					</tr>
					<tr>
						<td>
							<label>Direccion:</label>
						</td>
						<td>
							<form:input path="direccion" type="text" ></form:input>
						</td>
					</tr>
					<tr>
						<td>
							<label>Comuna:</label>
						</td>
						<td>
							<form:input path="comuna" type="text" ></form:input>
						</td>
					</tr>
					<tr>
						<td>
							<label>Ciudad:</label>
						</td>
						<td>
							<form:input path="ciudad" type="text" ></form:input>
						</td>
					</tr>
					<tr>
						<td>
							<label>Telefono:</label>
						</td>
						<td>
							<form:input path="telefono" type="text" ></form:input>
						</td>
					</tr>
					<tr>
						<td>
							<label>Contacto:</label>
						</td>
						<td>
							<form:input path="contacto" type="text" ></form:input>
						</td>
					</tr>
					<tr>
						<td>
							<label>Email:</label>
						</td>
						<td>
							<form:input path="email" type="text" ></form:input>
						</td>
					</tr>
					<tr>
						<td>
							<button type="submit" class="btn btn-primary">Guardar Cliente</button>
						</td>
					</tr>	
				</table>
				<label title="${userForms}"></label>
			</div>
		</form:form>
	</body>
</html>