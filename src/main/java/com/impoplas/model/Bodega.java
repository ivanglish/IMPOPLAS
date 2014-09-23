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
@Table(name = "bodega")
public class Bodega {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id_bodega", nullable = false)
	private long id;

	@Column(name = "nombre", nullable = false)
	private String nombre;
	
	@Column(name = "direccion", nullable = false)
	private String direccion;
	
	@Column(name = "comuna", nullable = false)
	private String comuna;
	
	@Column(name = "ciudad", nullable = false)
	private String ciudad;
	
	@Column(name = "telefono", nullable = false)
	private String telefono;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getComuna() {
		return comuna;
	}

	public void setComuna(String comuna) {
		this.comuna = comuna;
	}

	public String getCiudad() {
		return ciudad;
	}

	public void setCiudad(String ciudad) {
		this.ciudad = ciudad;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}
}
