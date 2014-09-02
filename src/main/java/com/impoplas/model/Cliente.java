package com.impoplas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

import org.springframework.stereotype.Component;

@Component
@Entity
@Table(name = "cliente")
public class Cliente {
	
	@Id
	@Column(name = "rut", nullable = false)
	private String rut;

	@Column(name = "razon_social", nullable = false)
	private String razonSocial;
	
	@Column(name = "giro", nullable = false)
	private String giro;
	
	@Column(name = "direccion", nullable = false)
	private String direccion;
	
	@Column(name = "comuna", nullable = false)
	private String comuna;
	
	@Column(name = "ciudad", nullable = false)
	private String ciudad;
	
	@Column(name = "telefono", nullable = false)
	private String telefono;
	
	@Column(name = "contacto", nullable = false)
	private String contacto;
	
	@Column(name = "email", nullable = false)
	private String email;
	
	public String getRut() {
		return rut;
	}

	public void setRut(String rut) {
		this.rut = rut;
	}

	public String getRazonSocial() {
		return razonSocial;
	}

	public void setRazonSocial(String razonSocial) {
		this.razonSocial = razonSocial;
	}

	public String getGiro() {
		return giro;
	}

	public void setGiro(String giro) {
		this.giro = giro;
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

	public String getContacto() {
		return contacto;
	}

	public void setContacto(String contacto) {
		this.contacto = contacto;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
