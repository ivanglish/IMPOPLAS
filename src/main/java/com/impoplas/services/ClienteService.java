package com.impoplas.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.impoplas.dao.interfaces.IClienteDao;
import com.impoplas.model.Cliente;
import com.impoplas.services.interfaces.IClienteService;

@Service
public class ClienteService implements IClienteService{
	
	@Autowired
	private IClienteDao cliDao;

	public ClienteService() {
		super();
	}

	public boolean saveCliente(Cliente c) {
		return cliDao.saveCliente(c);

	}
	
	@Override
	public Cliente getClienteByRut(String rut) {
		return cliDao.getById(Cliente.class, rut);
		
	}
	

	public IClienteDao getCliDao() {
		return cliDao;
	}

	public void setCliDao(IClienteDao cliDao) {
		this.cliDao = cliDao;
	}

	
	

}
