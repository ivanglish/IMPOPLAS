package com.impoplas.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.impoplas.dao.interfaces.IProductDao;
import com.impoplas.model.Cotizacion;
import com.impoplas.model.DetalleProducto;
import com.impoplas.model.Product;
import com.impoplas.services.interfaces.IProductService;

@Service
public class ProductService implements IProductService{
	
	@Autowired
	private IProductDao productDao;
	
	private static List<Product> listpro = new ArrayList<Product>(); 
	
	public String stripCodigo(String productDetails){
		
		String[] details= productDetails.split(",");
		return details[0];
	
	}
	
	public Cotizacion stripProduct(String productDetails, long cantidad){
		
		String[] details= productDetails.split(",");
		Product p = new Product();
		p.setCantidad(cantidad);
		p.setProductCodigo(details[0]);
		p.setProductNombre(details[1]);
		p.setProductMedida(details[2]);
		p.setProductPrecio(Long.valueOf(details[3]).longValue());
		p.setSubtotal(p.getProductPrecio()*cantidad);
		listpro.add(p);
		
		Cotizacion coti= new Cotizacion();
		
		for (Product product : listpro) {
			
			coti.setSubtotal(product.getSubtotal()+coti.getSubtotal());
		}		
		
		coti.setIva(coti.getSubtotal()*0.019);
		coti.setTotal(coti.getSubtotal()+coti.getIva());
		coti.setProductoDetalle(listpro);		
		return coti;		
	}
}
