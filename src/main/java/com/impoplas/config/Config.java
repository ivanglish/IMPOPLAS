package com.impoplas.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ImportResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@Configuration
@ComponentScan("com.impoplas")
@ImportResource("classpath:applicationContext.xml")
public class Config extends WebMvcConfigurerAdapter{
	
	@Bean
    public ViewResolver getViewResolver(){
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/pages/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
	}
    
//    @Value("${mail.smtp.host}")
//    private String host;
//    
//    @Value("${mail.smtp.port}")
//    private String port;
//    
//    @Value("${mail.smtp.username}")
//    private String username;
//    
//    @Value("${mail.smtp.password}")
//    private String password;
//    
//    @Bean
//    public JavaMailSenderImpl mailSender(){
//        JavaMailSenderImpl object = new JavaMailSenderImpl();
//        object.setHost(host);
//        object.setPort(Integer.valueOf(port));
//        object.setUsername(username);
//        object.setPassword(password);
//        Properties javaMailProperties = new Properties();
//        javaMailProperties.setProperty("mail.transport.protocol", "smtp");
//        javaMailProperties.setProperty("mail.smtp.auth", "true");
//        javaMailProperties.setProperty("mail.smtp.starttls.enable", "true");
//        object.setJavaMailProperties(javaMailProperties);
//        return object;
//    } 
}


