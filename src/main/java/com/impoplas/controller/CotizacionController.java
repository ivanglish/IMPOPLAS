package com.impoplas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.dao.interfaces.IProductDao;
import com.impoplas.model.Cliente;
import com.impoplas.model.Detalle;
import com.impoplas.services.interfaces.IClienteService;
import com.impoplas.services.interfaces.IProductService;

@Controller
public class CotizacionController {
	
	@Autowired
	private IClienteService cliService;

	@Autowired
	private IProductService proService; 
	
	@RequestMapping(value = "/crearCotizacion", method = RequestMethod.GET) 
    public ModelAndView crearCotizacion()
    {
		Cliente cliente = new Cliente();
		Detalle detalle = new Detalle();
    	ModelAndView mav = new ModelAndView("crearCotizacion"); 
    	mav.addObject("clienteModel", cliente);
    	mav.addObject("detalleModel", detalle);
		
		return mav;
	
    }	
	
	
	@RequestMapping(value = "/buscaClienteCoti", method = RequestMethod.GET) 
    public ModelAndView buscaCliente(@RequestParam("rutBuscar") String rutBuscar)
    {
		
		Detalle detalle = new Detalle();
    	ModelAndView mav = new ModelAndView("crearCotizacion"); 
    	mav.addObject("clienteModel", cliService.getClienteByRut(rutBuscar));
    	mav.addObject("detalleModel", detalle);
		
		return mav;
	
    }
	
	@RequestMapping(value = "/addProduct", method = RequestMethod.GET) 
    public ModelAndView addProduct(@RequestParam("product_name") String productName, @RequestParam("cantidad") String cantidad, @RequestParam("product_codigo") String codigo)
    {
		Detalle detalle = proService.getProductByCode(codigo,Long.valueOf(codigo).longValue());
    	ModelAndView mav = new ModelAndView("crearCotizacion"); 
    	mav.addObject("detalleModel", detalle);
		
		return mav;
	
    }
	
	
	

}
