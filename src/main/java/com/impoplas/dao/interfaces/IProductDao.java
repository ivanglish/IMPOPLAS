package com.impoplas.dao.interfaces;

import com.impoplas.model.Product;
import com.impoplas.model.User;

public interface IProductDao extends BaseDAO<Product> {
	
	public Product getProductrByCodigo(String codigo);


}
