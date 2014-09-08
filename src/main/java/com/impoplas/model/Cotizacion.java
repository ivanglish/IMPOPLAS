package com.impoplas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.impoplas.model.Cliente;

import org.springframework.stereotype.Component;

@Component
@Entity
@Table(name = "cotizacion")
public class Cotizacion {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id_cotizacion", nullable = false)
	private long idCotizacion;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "rut")
	private Cliente cliente;

}
