package com.impoplas.dao.interfaces;

import com.impoplas.model.User;

public interface IUserDao  extends BaseDAO<User> {
	
	public User getUserInfo(String usuario,String password);

}
