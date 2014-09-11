package com.impoplas.dao;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.impoplas.dao.interfaces.IUserDao;
import com.impoplas.model.User;


@Repository
public class UserDao  extends BaseDAOImpl<User> implements IUserDao {


	private User user;
	
	public UserDao() {
		super(User.class);
		// TODO Auto-generated constructor stub
	}

	@Transactional
	public User getUserInfo(String usuario,String password){
		Criteria criteria = getSession().createCriteria(User.class)
	            .add(Restrictions.eq( "nombre" , usuario))
	            .add(Restrictions.eq( "password" , password));
		return (User) criteria.uniqueResult();
	}
	
}
