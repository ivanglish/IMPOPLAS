package com.impoplas.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.springframework.stereotype.Component;

@Component
public class Detalle {
	
	List<Product> productoDetalle;
	String medioPago;
	String observacion;
	String vendedor;
	String validez;
	String correo;
	double subtotal;
	double iva;
	double total;
	
	public List<Product> getProductoDetalle() {
		return productoDetalle;
	}
	public void setProductoDetalle(List<Product> productoDetalle) {
		this.productoDetalle = productoDetalle;
	}
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

}
