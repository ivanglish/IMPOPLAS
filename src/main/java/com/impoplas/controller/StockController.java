package com.impoplas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

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
    	ModelAndView mav = new ModelAndView("/consultarStock"); 
    	mav.addObject("stockModel", stockService.getProductStockByCode(codigo));
		return mav;
	
    }	

}
