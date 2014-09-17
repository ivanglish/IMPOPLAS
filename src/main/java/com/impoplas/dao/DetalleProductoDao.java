package com.impoplas.dao;

import org.springframework.stereotype.Repository;

import com.impoplas.dao.interfaces.ICotizacionDao;
import com.impoplas.dao.interfaces.IDetalleProductoDao;
import com.impoplas.dao.interfaces.IProductDao;
import com.impoplas.model.Cotizacion;
import com.impoplas.model.DetalleProducto;
import com.impoplas.model.Product;

@Repository
public class DetalleProductoDao extends BaseDAOImpl<DetalleProducto> implements IDetalleProductoDao {
	
	public DetalleProductoDao() {
		super(DetalleProducto.class);
		// TODO Auto-generated constructor stub
	}
}
