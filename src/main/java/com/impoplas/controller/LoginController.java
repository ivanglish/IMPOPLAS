package com.impoplas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.model.Cliente;

@Controller
public class LoginController {
	
	@RequestMapping(value = "/login", method = RequestMethod.GET) 
    public ModelAndView login(@ModelAttribute("clienteModel")Cliente cliente)
    {
    	ModelAndView mav = new ModelAndView("home"); 
    	mav.addObject("clienteModel", cliente);
		
		return mav;
	
    }	

}
