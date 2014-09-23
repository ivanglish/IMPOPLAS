package com.impoplas.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.impoplas.dao.interfaces.IStockDao;
import com.impoplas.model.Inventario;
import com.impoplas.services.interfaces.IStockService;

@Service
public class StockService implements IStockService{
	
	@Autowired
	IStockDao stockDao;
	
	public List<Inventario> getProductStockByCode(String codigo){

		return stockDao.getProductStockByCode(codigo);
	}

}
