package com.impoplas.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.impoplas.dao.interfaces.IUserDao;
import com.impoplas.model.User;
import com.impoplas.services.interfaces.IUserService;

@Service
public class UserService implements IUserService{
	
	
	@Autowired
	private IUserDao userDao;
	
	public User getUserInfo(String usuario,String password){
		
		User user = userDao.getUserInfo(usuario, password);
		
		return user;
		
	}


}
