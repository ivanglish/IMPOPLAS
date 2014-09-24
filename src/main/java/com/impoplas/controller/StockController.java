package com.impoplas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.model.Inventario;
import com.impoplas.services.interfaces.IStockService;

@Controller
public class StockController {
	
	
	@Autowired
	IStockService stockService;
	
	@RequestMapping(value = "/consultarStock", method = RequestMethod.GET) 
    public ModelAndView consultarStock()
    {
    	ModelAndView mav = new ModelAndView("/consultarStock"); 
		return mav;
	
    }	
	
	@RequestMapping(value = "/consultarStockByProduct", method = RequestMethod.GET) 
    public ModelAndView consultarStockByProduct(@RequestParam("codigo") String codigo)
    {	
		long cantidadTotal=0;
		List<Inventario> list = stockService.getProductStockByCode(codigo);
		for (Inventario inventario : list) {
			cantidadTotal+=inventario.getCantidad();
		}
    	ModelAndView mav = new ModelAndView("/consultarStock"); 
    	mav.addObject("stockModel", list);
    	mav.addObject("cantidadTotal", cantidadTotal);
		return mav;
	
    }	

}
