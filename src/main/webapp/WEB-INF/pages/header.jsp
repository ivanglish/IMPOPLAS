<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
  <div class="navbar navbar-default navbar-fixed-top">
    <div class="container" style="margin-left:5%; margin-right:5%; width:auto;">
        <div class="nav-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <img src="<c:url value="/resources/images/logo-text.png"/>" class="navbar-brand" style="padding:2px;" height="49px"> 
        </div>
        <div class="navbar-collapse collapse">
	        <ul class="nav navbar-nav">
		        	<li><a href="<c:url value="/home"/>"><span class="glyphicon glyphicon-home"></span> Pagina Principal</a></li>
		        	<c:if test="${currentUser.role.name == 'admin' }">
		        		<li><a href="<c:url value="/admin"/>"><span class="glyphicon glyphicon-wrench"></span> Admin</a></li>
		        	</c:if>
		        	<li><a href="<c:url value="/slide"/>"><span class="glyphicon glyphicon-play"></span> Caja</a></li>
		        	<li><a href="<c:url value="/slide"/>"><span class="glyphicon glyphicon-play"></span> Facturacion</a></li>
		        	<li><a href="<c:url value="/slide"/>"><span class="glyphicon glyphicon-play"></span> Reportes</a></li>
		        	<li><a href="<c:url value="/IMPOPLAS/crearCotizacion"/>"><span class="glyphicon glyphicon-play"></span> Cotizacion</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
				<li class="dropdown"><a href="#" class="dropdown-toggle"
					data-toggle="dropdown"><span class="glyphicon glyphicon-user"></span>
						${userModel.rol.rol}<b class="caret"></b></a>
					<ul class="dropdown-menu">
						<c:choose>
							<c:when test="${currentUser.role.name == 'admin' }">
								<li><a
									href="${pageContext.request.contextPath}/j_spring_security_logout?redirectTo=https://accounts.google.com/Logout"><span
										class="glyphicon glyphicon-off"></span>Logout</a>
								</li>
							</c:when>
							<c:otherwise>
								<li><a
									href="${pageContext.request.contextPath}/admin"><span
										class="glyphicon glyphicon-off"></span>Login</a>
								</li>
							</c:otherwise>
						</c:choose>
					</ul></li>
			</ul>
        </div>
    </div>
</div>
