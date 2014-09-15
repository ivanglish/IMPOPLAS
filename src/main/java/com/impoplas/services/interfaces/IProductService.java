package com.impoplas.services.interfaces;

import com.impoplas.model.Detalle;

public interface IProductService {
	
	public Detalle getProductByCode(String codigo,long cantidad);
	
	public Detalle stripProduct(String productDetails,long cantidad);
	

}
