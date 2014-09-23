package com.impoplas.services.interfaces;

import java.util.List;

import com.impoplas.model.Inventario;

public interface IStockService {
	
	public List<Inventario> getProductStockByCode(String codigo);

}
