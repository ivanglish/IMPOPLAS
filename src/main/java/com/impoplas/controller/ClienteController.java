package com.impoplas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.model.Cliente;
import com.impoplas.services.interfaces.IClienteService;


@Controller
public class ClienteController {
	
	
	@Autowired
	private IClienteService cliService;
	
	public ClienteController() {
		super();
	}
	

	@RequestMapping(value = "/addCliente", method = RequestMethod.GET) 
    public ModelAndView addCliente(@ModelAttribute("clienteModel")Cliente cliente)
    {
    	ModelAndView mav = new ModelAndView("addCliente"); 
    	mav.addObject("clienteModel", cliente);
		
		return mav;
	
    }	
	
	@RequestMapping(value = "/modifyCliente", method = RequestMethod.GET) 
    public ModelAndView modifyCliente(@ModelAttribute("clienteModel")Cliente cliente)
    {
    	ModelAndView mav = new ModelAndView("modifyCliente"); 
    	mav.addObject("clienteModel", cliente);
		
		return mav;
	
    }
	
	@RequestMapping(value = "/buscaCliente", method = RequestMethod.GET) 
    public ModelAndView buscaCliente(@RequestParam("rutBuscar") String rutBuscar)
    {
		
    	ModelAndView mav = new ModelAndView("modifyCliente"); 
    	mav.addObject("clienteModel", cliService.getClienteByRut(rutBuscar));
		
		return mav;
	
    }
	
	
	
	@RequestMapping(value = "/saveCliente", method = RequestMethod.POST) 
    public String saveCliente(@ModelAttribute("clienteModel")Cliente cliente, Model model)
    {
		System.out.println("dandole");
		if (cliService.saveCliente(cliente)){
			model.addAttribute("estado", "el cliente a sido guardado correctamente");
		}else{
			model.addAttribute("estado", "el cliente a sido guardado correctamente");
		}
		return "addCliente";
    }	
	
	public IClienteService getCliService() {
		return cliService;
	}
	
	public void setCliService(IClienteService cliService) {
		this.cliService = cliService;
	}


}
