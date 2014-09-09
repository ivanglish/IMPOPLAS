package com.impoplas.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import org.springframework.stereotype.Component;

@Component
@Entity
@Table(name = "roles")
public class Roles {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id_role", nullable = false)
	private long idRoles;
	
	@Column(name = "rol", nullable = false)
	private String rol;
	
	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "role_permisos", joinColumns = { @JoinColumn(name = "id_role") }, inverseJoinColumns = { @JoinColumn(name = "id_permiso") })
	private Set<Permisos> permisos = new HashSet<Permisos>();
	
	//@OneToMany(fetch = FetchType.LAZY)
	//private Set<Permisos> permisos = new HashSet<Permisos>();
	

	public long getIdRoles() {
		return idRoles;
	}

	public void setIdRoles(long idRoles) {
		this.idRoles = idRoles;
	}

	public String getRol() {
		return rol;
	}

	public void setRol(String rol) {
		this.rol = rol;
	}

}
