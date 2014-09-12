package com.impoplas.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.impoplas.dao.interfaces.IProductDao;
import com.impoplas.model.Detalle;
import com.impoplas.model.Product;
import com.impoplas.services.interfaces.IProductService;

@Service
public class ProductService implements IProductService{
	
	@Autowired
	private IProductDao productDao;
	
	private static List<Product> listpro = new ArrayList<>(); 
	
	public Detalle getProductByCode(String codigo, long cantidad){

		Product p=productDao.getById(Product.class, codigo);
		p.setCantidad(cantidad);
		p.setSubtotal(p.getProductPrecio()*cantidad);
		
		listpro.add(p);
		
		Detalle detalle = new Detalle();
		detalle.setProductoDetalle(listpro);

		return detalle;
	}

}
