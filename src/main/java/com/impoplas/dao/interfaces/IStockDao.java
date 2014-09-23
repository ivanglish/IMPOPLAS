package com.impoplas.dao.interfaces;

import java.util.List;

import com.impoplas.model.Inventario;

public interface IStockDao extends BaseDAO<Inventario>{
	
	public List<Inventario>  getProductStockByCode(String codigo);

}
