package com.impoplas.dao;

import org.springframework.stereotype.Repository;

import com.impoplas.dao.interfaces.IFamiliaDAO;
import com.impoplas.model.FamiliaProduct;

@Repository
public class FamiliaDAO  extends BaseDAOImpl<FamiliaProduct> implements IFamiliaDAO {
	
	public FamiliaDAO() {
		super(FamiliaProduct.class);
		// TODO Auto-generated constructor stub
	}

}
