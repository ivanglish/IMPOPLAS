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
import com.impoplas.model.Cotizacion;
import com.impoplas.model.Product;
import com.impoplas.services.interfaces.IClienteService;
import com.impoplas.services.interfaces.ICotizacionService;
import com.impoplas.services.interfaces.IProductService;


@Controller
@SessionAttributes({"clienteModel","cotizacionModel"})
public class CotizacionController {
	
	@Autowired
	private ICotizacionService cotizacionService;
	
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
		Cotizacion cotizacion = new Cotizacion();
    	ModelAndView mav = new ModelAndView("crearCotizacion"); 
    	mav.addObject("clienteModel", cliente);
    	mav.addObject("cotizacionModel", cotizacion);
		
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
		Cotizacion cotizacion = proService.stripProduct(productDetails, Long.valueOf(cantidad).longValue());
    	ModelAndView mav = new ModelAndView("crearCotizacion"); 
    	mav.addObject("clienteModel", cliente);
    	mav.addObject("cotizacionModel", cotizacion);
		
		return mav;
	
    }
	
	@RequestMapping(value = "/saveCotizacion", method = RequestMethod.POST) 
    public ModelAndView saveCotizacion(@ModelAttribute("clienteModel") Cliente cliente, @ModelAttribute("cotizacionModel") Cotizacion coti)
    {
		long cotiId = cotizacionService.saveCotizacion(coti, cliente);
    	ModelAndView mav = new ModelAndView("crearCotizacion"); 
    	mav.addObject("msg", "La cotizacion ha sido creada exitosamente. El numero es "+cotiId);
		return mav;
	
    }

}
