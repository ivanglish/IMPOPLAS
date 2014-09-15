package com.impoplas.dao;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.impoplas.dao.interfaces.IProductDao;
import com.impoplas.model.Product;
import com.impoplas.model.User;

@Repository
public class ProductDao  extends BaseDAOImpl<Product> implements IProductDao  {
	
	public ProductDao() {
		super(Product.class);
		// TODO Auto-generated constructor stub
	}
	
	@Transactional
	public Product getProductrByCodigo(String codigo){
		
		Criteria criteria = getSession().createCriteria(Product.class)
	            .add(Restrictions.eq( "productCodigo" , codigo));
		return (Product) criteria.uniqueResult();
	}


}
