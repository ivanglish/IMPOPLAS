package com.impoplas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import org.springframework.stereotype.Component;

@Component
@Entity
@Table(name = "product")
public class Product {

	
	@Id
	@Column(name = "codigo", nullable = false)
	private String productCodigo;
	
	@Column(name = "nombre", nullable = false)
	private String productNombre;
	
	@Column(name = "medida", nullable = false)
	private String productMedida;
	

	@Column(name = "precio", nullable = false)
	private long productPrecio;
	
	@Transient
	private long cantidad;
	
	@Transient
	private long subtotal;

	public String getProductNombre() {
		return productNombre;
	}

	public void setProductNombre(String productNombre) {
		this.productNombre = productNombre;
	}
	
	public String getProductMedida() {
		return productMedida;
	}

	public void setProductMedida(String productMedida) {
		this.productMedida = productMedida;
	}

	public long getProductPrecio() {
		return productPrecio;
	}

	public void setProductPrecio(long productPrecio) {
		this.productPrecio = productPrecio;
	}
	
	public String getProductCodigo() {
		return productCodigo;
	}

	public void setProductCodigo(String productCodigo) {
		this.productCodigo = productCodigo;
	}

	public long getCantidad() {
		return cantidad;
	}

	public void setCantidad(long cantidad) {
		this.cantidad = cantidad;
	}
	
	public long getSubtotal() {
		return subtotal;
	}

	public void setSubtotal(long subtotal) {
		this.subtotal = subtotal;
	}

}
