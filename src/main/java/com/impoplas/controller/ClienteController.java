package com.impoplas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.dao.interfaces.IProductDao;
import com.impoplas.model.Cliente;
import com.impoplas.model.Product;
import com.impoplas.services.interfaces.IClienteService;


@Controller
@SessionAttributes({"clienteModel"})
public class ClienteController {
	
	
	@Autowired
	private IClienteService cliService;
	
	@Autowired
	private IProductDao proDao; 
	

	@ModelAttribute("productModelList")
	 public List<Product> getAllProducts() {
        return proDao.getAll();
    }
	
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
	
	@RequestMapping(value = "/addClienteFromCoti", method = RequestMethod.GET) 
    public ModelAndView addClienteFromCoti(@ModelAttribute("clienteModel")Cliente cliente)
    {
    	ModelAndView mav = new ModelAndView("addCliente"); 
    	mav.addObject("clienteModel", cliente);
    	mav.addObject("fromCoti", 1);
		
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
    public ModelAndView saveCliente(@RequestParam("from") String from, @ModelAttribute("clienteModel")Cliente cliente, Model model)
    {
		if (cliService.saveCliente(cliente)){
			model.addAttribute("estado", "el cliente a sido guardado correctamente");
		}else{
			model.addAttribute("estado", "el cliente a sido guardado correctamente");
		}
		
		ModelAndView mav = new ModelAndView();
		if(from.equals("fromCoti")){
			mav.addObject("clienteModel", cliente);
			mav.setViewName("crearCotizacion");
		}
		else
			mav.setViewName("addCliente");
		return mav;
    }	
	
	
	public IClienteService getCliService() {
		return cliService;
	}
	
	public void setCliService(IClienteService cliService) {
		this.cliService = cliService;
	}
	
	public IProductDao getProDao() {
		return proDao;
	}

	public void setProDao(IProductDao proDao) {
		this.proDao = proDao;
	}


}
