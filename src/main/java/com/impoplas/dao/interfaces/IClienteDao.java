package com.impoplas.dao.interfaces;

import com.impoplas.model.Cliente;

public interface IClienteDao extends BaseDAO<Cliente>{

	public boolean saveCliente(Cliente c);

}
