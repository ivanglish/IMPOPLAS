package com.impoplas.services.interfaces;

import com.impoplas.model.Cotizacion;


public interface IProductService {
	
//	public Cotizacion getProductByCode(String codigo,long cantidad);
	
	public String stripCodigo(String productDetails);
	
	public Cotizacion stripProduct(String productDetails,long cantidad);
	

}
