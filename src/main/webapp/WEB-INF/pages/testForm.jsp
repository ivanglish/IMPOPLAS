<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<!DOCTYPE html>
<html>
	<head>
	<script src="<c:url value="/resources/js/jquery-2.0.3.min.js"/>" type="text/javascript"></script>
	<script src="<c:url value="/resources/tinymce/tinymce.min.js"/>" type="text/javascript"></script>
	<script src="<c:url value="/resources/bootstrap-3.0.3/js/bootstrap.min.js"/>" type="text/javascript"></script>
	</head>
	<body>	
		<form:form commandName="article" method="POST" action="addData/">
			<table>
				<tr>
					<td>Title:</td>
					<td><form:input path="title" /></td>
				</tr>
				<tr>
					<td>Body:</td>
					<td><form:input path="body" /></td>
				</tr>
				<tr>
					<td>Description:</td>
					<td><form:input path="articleDescription" /></td>
				</tr>
				<tr>
					<td colspan="2">
					<input type="submit" value="Save Changes" />
					</td>
				</tr>
			</table>
		</form:form>
	</body>
</html>