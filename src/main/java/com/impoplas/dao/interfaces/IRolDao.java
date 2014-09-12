package com.impoplas.dao.interfaces;

import com.impoplas.model.Roles;

public interface IRolDao  extends BaseDAO<Roles> {
	
	public Roles getUserRoleInfo(long  id);

}
