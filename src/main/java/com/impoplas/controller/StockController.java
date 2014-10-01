package com.impoplas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.dao.interfaces.IProductDao;
import com.impoplas.model.Inventario;
import com.impoplas.model.Product;
import com.impoplas.services.interfaces.IStockService;

@Controller
public class StockController {
	
	
	@Autowired
	IStockService stockService;
	
	@Autowired
	private IProductDao proDao; 
	
	@ModelAttribute("productModelList")
	 public List<Product> getAllProducts() {
       return proDao.getAll();
   }
	
	@RequestMapping(value = "/consultarStock", method = RequestMethod.GET) 
    public ModelAndView consultarStock()
    {
    	ModelAndView mav = new ModelAndView("/consultarStock"); 
		return mav;
	
    }	
	
	@RequestMapping(value = "/ingresarProductos", method = RequestMethod.GET) 
    public ModelAndView ingresarProductos()
    {
		Product product = new Product();
    	ModelAndView mav = new ModelAndView("/ingresarProductos");
    	mav.addObject("productModel", product);
		return mav;
	
    }	
	
	@RequestMapping(value = "/consultarStockByProduct", method = RequestMethod.GET) 
    public ModelAndView consultarStockByProduct(@RequestParam("codigo") String codigo, @RequestParam("productList") String codigoByName)
    {	
		long cantidadTotal=0;
		String codigoFinal= (codigo=="") ? codigoByName: codigo;
		List<Inventario> list = stockService.getProductStockByCode(codigoFinal);
		for (Inventario inventario : list) {
			cantidadTotal+=inventario.getCantidad();
		}
    	ModelAndView mav = new ModelAndView("/consultarStock"); 
    	mav.addObject("stockModel", list);
    	mav.addObject("cantidadTotal", cantidadTotal);
		return mav;
	
    }	

}
