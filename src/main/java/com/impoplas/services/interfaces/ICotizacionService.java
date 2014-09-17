package com.impoplas.services.interfaces;

import java.util.Set;

import com.impoplas.model.Cliente;
import com.impoplas.model.Cotizacion;
import com.impoplas.model.DetalleProducto;

public interface ICotizacionService {

	public Cotizacion saveCotizacion(Cotizacion coti, Cliente cliente);

}