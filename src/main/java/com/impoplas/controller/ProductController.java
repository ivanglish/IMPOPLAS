package com.impoplas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.dao.interfaces.IProductDao;
import com.impoplas.model.Product;

@Controller
public class ProductController {
	
	@Autowired
	private IProductDao productDao;
	
	@RequestMapping(value = "/addProducto", method = RequestMethod.GET) 
    public ModelAndView crearCotizacion()
    {
		Product product = new Product();
		ModelAndView mav = new ModelAndView("addProductoYFamilia");
		mav.addObject("productModel", product);
		return new ModelAndView("addProductoYFamilia");
	
    }	
	
	
	@RequestMapping(value = "/saveProducto", method = RequestMethod.POST) 
    public ModelAndView saveCliente(@ModelAttribute("productModel")Product product)
    {
		ModelAndView mav = new ModelAndView("addProductoYFamilia");
		productDao.save(product);
		return mav;
    }	

}
