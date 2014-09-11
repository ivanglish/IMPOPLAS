package com.impoplas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class StockController {
	
	
	
	
	@RequestMapping(value = "/consultarStock", method = RequestMethod.GET) 
    public ModelAndView consultarStock()
    {
    	ModelAndView mav = new ModelAndView("/consultarStock"); 

		
		return mav;
	
    }	

}
