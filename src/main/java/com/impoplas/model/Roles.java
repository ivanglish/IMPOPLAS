package com.impoplas.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
	
	
	private Set<User> users = new HashSet<User>(0);


	public long getIdRoles() {
		return idRoles;
	}

	public void setIdRoles(long idRoles) {
		this.idRoles = idRoles;
	}

	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "roles")
	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	public long getId() {
		return idRoles;
	}

	public void setId(long id) {
		this.idRoles = id;
	}

	public String getRol() {
		return rol;
	}

	public void setRol(String rol) {
		this.rol = rol;
	}

}
