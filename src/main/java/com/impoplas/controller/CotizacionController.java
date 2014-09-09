package com.impoplas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.model.Cliente;
import com.impoplas.model.Detalle;
import com.impoplas.services.interfaces.IClienteService;

@Controller
public class CotizacionController {
	

	
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
	
	
	

}
