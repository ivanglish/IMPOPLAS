package com.impoplas.dao.interfaces;

import java.util.List;

public interface BaseDAO<T> {
    void save(T t);

    void saveOrUpdate(T t);

    void update(T t);

    void delete(T t);

    List<T> getAll();
    
    T getById(Class <T> entity, final Long id);
}
