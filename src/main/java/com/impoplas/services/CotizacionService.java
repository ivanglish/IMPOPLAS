package com.impoplas.services;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.impoplas.dao.interfaces.ICotizacionDao;
import com.impoplas.dao.interfaces.IDetalleProductoDao;
import com.impoplas.model.Cliente;
import com.impoplas.model.Cotizacion;
import com.impoplas.model.DetalleProducto;
import com.impoplas.services.interfaces.ICotizacionService;

@Service
public class CotizacionService implements ICotizacionService {
	
	@Autowired
	private ICotizacionDao cotizacionDao;
	
	@Autowired
	private IDetalleProductoDao detalleProductoDao;
	
	
	public Cotizacion saveCotizacion(Cotizacion coti, Cliente cliente){
		
		coti.setCliente(cliente);
		cotizacionDao.save(coti);
		
		return null;
	}

}
