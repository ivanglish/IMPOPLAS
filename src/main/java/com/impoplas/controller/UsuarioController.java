package com.impoplas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.dao.interfaces.IUserDao;
import com.impoplas.model.User;

@Controller
public class UsuarioController {
	
	@Autowired
	private IUserDao userDao; 
	
	@RequestMapping(value = "/crearUsuario", method = RequestMethod.GET) 
    public ModelAndView crearCotizacion()
    {
		User user = new User();
		ModelAndView mav = new ModelAndView("addUser");
		mav.addObject("userModel", user);
		return mav;
	
    }	
	
	@RequestMapping(value = "/saveUser", method = RequestMethod.POST) 
    public ModelAndView saveCliente(@ModelAttribute("userModel")User user)
    {
		ModelAndView mav = new ModelAndView("addUser");
		userDao.save(user);
		return mav;
    }	
	

}
