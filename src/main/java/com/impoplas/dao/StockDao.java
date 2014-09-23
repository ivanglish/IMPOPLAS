package com.impoplas.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.impoplas.dao.interfaces.IStockDao;
import com.impoplas.model.Inventario;
import com.impoplas.model.Product;

@Repository
public class StockDao  extends BaseDAOImpl<Inventario> implements IStockDao {
	
	public StockDao() {
		super(Inventario.class);
	}
	
	@Transactional
	public List<Inventario> getProductStockByCode(String codigo){
		Product product = new Product();
		product.setProductCodigo(codigo);
		Criteria criteria = getSession().createCriteria(Inventario.class)
	            .add(Restrictions.eq( "product" , product));
		return (List<Inventario>) criteria.list();
	}

}
