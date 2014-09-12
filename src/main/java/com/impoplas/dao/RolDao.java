package com.impoplas.dao;

import org.springframework.stereotype.Repository;

import com.impoplas.dao.interfaces.IRolDao;
import com.impoplas.dao.interfaces.IUserDao;
import com.impoplas.model.Roles;
import com.impoplas.model.User;

@Repository
public class RolDao extends BaseDAOImpl<Roles> implements IRolDao {


	private Roles rol;
	
	public RolDao() {
		super(Roles.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public Roles getUserRoleInfo(long id) {
		// TODO Auto-generated method stub
		return null;
	}


}
