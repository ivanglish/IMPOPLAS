package com.impoplas.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

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
	
//	@OneToOne(cascade = CascadeType.ALL)
//	private Detalle detalle;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "id")
	private Set<DetalleProducto> detalleProducto= new HashSet<DetalleProducto>() ;
	
	@Transient
	List<Product> productoDetalle;
	

	@Column(name = "medioPago", nullable = false)
	String medioPago;
	
	@Column(name = "observacion")
	String observacion;
	
	@Column(name = "vendedor", nullable = false)
	String vendedor;
	
	@Column(name = "validez", nullable = false)
	String validez;
	
	@Column(name = "correo")
	String correo;
	
	@Column(name = "subtotal", nullable = false)
	double subtotal;
	
	@Column(name = "iva", nullable = false)
	double iva;
	
	@Column(name = "total", nullable = false)
	double total;
	

	public String getMedioPago() {
		return medioPago;
	}
	public void setMedioPago(String medioPago) {
		this.medioPago = medioPago;
	}
	public String getObservacion() {
		return observacion;
	}
	public void setObservacion(String observacion) {
		this.observacion = observacion;
	}
	public String getVendedor() {
		return vendedor;
	}
	public void setVendedor(String vendedor) {
		this.vendedor = vendedor;
	}
	public String getValidez() {
		return validez;
	}
	public void setValidez(String validez) {
		this.validez = validez;
	}
	public String getCorreo() {
		return correo;
	}
	public void setCorreo(String correo) {
		this.correo = correo;
	}
	
	public double getTotal() {
		return total;
	}
	public void setTotal(double d) {
		this.total = d;
	}
	
	public double getSubtotal() {
		return subtotal;
	}
	public void setSubtotal(double d) {
		this.subtotal = d;
	}
	public double getIva() {
		return iva;
	}
	public void setIva(double d) {
		this.iva = d;
	}
	

	public long getIdCotizacion() {
		return idCotizacion;
	}

	public void setIdCotizacion(long idCotizacion) {
		this.idCotizacion = idCotizacion;
	}

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}
	
	public Set<DetalleProducto> getDetalleProducto() {
		return detalleProducto;
	}
	public void setDetalleProducto(Set<DetalleProducto> detalleProducto) {
		this.detalleProducto = detalleProducto;
	}
	public List<Product> getProductoDetalle() {
		return productoDetalle;
	}
	public void setProductoDetalle(List<Product> productoDetalle) {
		this.productoDetalle = productoDetalle;
	}

//	public Detalle getDetalle() {
//		return detalle;
//	}
//
//	public void setDetalle(Detalle detalle) {
//		this.detalle = detalle;
//	}

}
