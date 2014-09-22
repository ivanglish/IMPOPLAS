package com.impoplas.dao;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.impoplas.dao.interfaces.IClienteDao;
import com.impoplas.model.Cliente;

@Repository
public class ClienteDao extends BaseDAOImpl<Cliente> implements IClienteDao{

	public ClienteDao() {
		super(Cliente.class);
	}

	@Transactional
	public boolean saveCliente(Cliente c) {
		
		getSession().saveOrUpdate(c);
		if (c.getRut()!=null){
			return true; 
		}else
			return false;

	}
}
