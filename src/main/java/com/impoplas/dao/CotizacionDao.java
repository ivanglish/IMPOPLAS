package com.impoplas.dao;

import org.springframework.stereotype.Repository;

import com.impoplas.dao.interfaces.ICotizacionDao;
import com.impoplas.dao.interfaces.IProductDao;
import com.impoplas.model.Cotizacion;
import com.impoplas.model.Product;
@Repository
public class CotizacionDao extends BaseDAOImpl<Cotizacion> implements ICotizacionDao {
	
	public CotizacionDao() {
		super(Cotizacion.class);
		// TODO Auto-generated constructor stub
	}
}
