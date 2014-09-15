package com.impoplas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.impoplas.dao.interfaces.IProductDao;
import com.impoplas.model.Cliente;
import com.impoplas.model.Detalle;
import com.impoplas.model.Product;
import com.impoplas.services.interfaces.IClienteService;
import com.impoplas.services.interfaces.IProductService;


@Controller
@SessionAttributes({"clienteModel","detalleModel"})
public class CotizacionController {
	
	@Autowired
	private IClienteService cliService;

	@Autowired
	private IProductService proService; 
	
	@Autowired
	private IProductDao proDao; 
	
	@ModelAttribute("productModelList")
	 public List<Product> getAllProducts() {
        return proDao.getAll();
    }
	
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
	
    	ModelAndView mav = new ModelAndView("crearCotizacion"); 
    	mav.addObject("clienteModel", cliService.getClienteByRut(rutBuscar));
		
		return mav;
	
    }
	
	@RequestMapping(value = "/addProduct", method = RequestMethod.GET) 
    public ModelAndView addProduct(@ModelAttribute("clienteModel") Cliente cliente, @RequestParam("productList") String productDetails, @RequestParam("cantidad") String cantidad)
    {
		Detalle detalle = proService.stripProduct(productDetails, Long.valueOf(cantidad).longValue());
    	ModelAndView mav = new ModelAndView("crearCotizacion"); 
    	mav.addObject("clienteModel", cliente);
    	mav.addObject("detalleModel", detalle);
		
		return mav;
	
    }

}
