package com.impoplas.dao.interfaces;

import com.impoplas.model.Cotizacion;
import com.impoplas.model.DetalleProducto;

public interface IDetalleProductoDao extends BaseDAO<DetalleProducto>{
	
	public Cotizacion saveCotizacion(DetalleProducto d);

}
