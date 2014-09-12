package com.impoplas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.model.Cliente;
import com.impoplas.model.User;
import com.impoplas.services.interfaces.IUserService;

@Controller
@SessionAttributes("userModel")
public class LoginController {
	
	@Autowired
	private IUserService userService;
	
	@RequestMapping(value = "/login", method = RequestMethod.POST) 
    public ModelAndView login(@RequestParam("usuario") String usuario, @RequestParam("password") String password,
    		@ModelAttribute("clienteModel")Cliente cliente)
    {
		
		
		User user = userService.getUserInfo(usuario, password);
		
		
    	ModelAndView mav = new ModelAndView("home"); 
    	mav.addObject("clienteModel", cliente);
    	mav.addObject("userModel", user);
		
		return mav;
	
    }	

}
