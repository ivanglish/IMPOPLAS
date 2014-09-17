package com.impoplas.services.interfaces;

import com.impoplas.model.Cotizacion;


public interface IProductService {
	
//	public Cotizacion getProductByCode(String codigo,long cantidad);
	
	public Cotizacion stripProduct(String productDetails,long cantidad);
	

}
