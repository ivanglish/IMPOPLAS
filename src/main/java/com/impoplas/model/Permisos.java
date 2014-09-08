package com.impoplas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.stereotype.Component;

@Component
@Entity
@Table(name = "permisos")
public class Permisos {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id_permiso", nullable = false)
	private long idPermiso;

	@Column(name = "permiso", nullable = false)
	private String permiso;
	
	@Column(name = "url", nullable = false)
	private String url;
	
	@Column(name = "descripcion", nullable = false)
	private String descripcion;

	
	public long getId() {
		return idPermiso;
	}

	public void setId(long idPermiso) {
		this.idPermiso = idPermiso;
	}

	public String getPermiso() {
		return permiso;
	}

	public void setPermiso(String permiso) {
		this.permiso = permiso;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

}
