package com.impoplas.services.interfaces;

import com.impoplas.model.Cliente;

public interface IClienteService {
	
	public boolean saveCliente(Cliente c);

	public Cliente getClienteByRut(String rut);

}
