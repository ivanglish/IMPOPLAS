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
	
	private static List<Product> listpro = new ArrayList<Product>(); 
	
	public Detalle getProductByCode(String codigo, long cantidad){

		Product p=productDao.getProductrByCodigo(codigo);
		p.setCantidad(cantidad);
		p.setSubtotal(p.getProductPrecio()*cantidad);
		
		listpro.add(p);
		Detalle detalle = new Detalle();
		detalle.setTotal(0);
		
		for (Product product : listpro) {
			
			detalle.setTotal(product.getSubtotal()+detalle.getTotal());
		}

		detalle.setProductoDetalle(listpro);

		return detalle;
	}
	
	public Detalle stripProduct(String productDetails, long cantidad){
		
		String[] details= productDetails.split(",");
		Product p = new Product();
		p.setCantidad(cantidad);
		p.setProductCodigo(details[0]);
		p.setProductNombre(details[1]);
		p.setProductMedida(details[2]);
		p.setProductPrecio(Long.valueOf(details[3]).longValue());
		p.setSubtotal(p.getProductPrecio()*cantidad);
		listpro.add(p);
		
		Detalle d= new Detalle();
		
		for (Product product : listpro) {
			
			d.setSubtotal(product.getSubtotal()+d.getSubtotal());
		}		
		
		d.setIva(d.getSubtotal()*0.019);
		d.setTotal(d.getSubtotal()+d.getIva());
		d.setProductoDetalle(listpro);		
		return d;		
	}
}
