package com.impoplas.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

import javax.persistence.CascadeType;


import org.springframework.stereotype.Component;

@Component
@Entity
@Table(name = "user")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id_user", nullable = false)
	private long idUser;
	
	@Id
	@Column(name = "nombre", nullable = false)
	private String nombre;

	@Column(name = "password", nullable = false)
	private String password;
	
	@Column(name = "activo", nullable = false)
	private boolean activo;


	
	private Set<Roles> roles = new HashSet<Roles>(0);
	
	public long getId() {
		return idUser;
	}

	public long getIdUser() {
		return idUser;
	}

	public void setIdUser(long idUser) {
		this.idUser = idUser;
	}

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "user_role", joinColumns = { @JoinColumn(name = "id_user") }, inverseJoinColumns = { @JoinColumn(name = "id_role") })
	public Set<Roles> getRoles() {
		return roles;
	}

	public void setRoles(Set<Roles> roles) {
		this.roles = roles;
	}

	public void setId(long idUser) {
		this.idUser = idUser;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean getActivo() {
		return activo;
	}

	public void setActivo(boolean activo) {
		this.activo = activo;
	}
	

}
