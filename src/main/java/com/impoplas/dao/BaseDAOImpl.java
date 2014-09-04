package com.impoplas.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.impoplas.dao.interfaces.BaseDAO;

public abstract class BaseDAOImpl<T> implements BaseDAO<T> {

    @Autowired
    private SessionFactory sessionFactory;

    private final Class<T> clazz;

    public BaseDAOImpl(final Class<T> clazzToSet) {
        this.clazz = clazzToSet;
    }

    public Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    @Transactional
    public void save(T entity) {

        getSession().save(entity);
    }

    @Override
    @Transactional
    public void saveOrUpdate(T entity) {

        getSession().saveOrUpdate(entity);
    }

    @Override
    @Transactional
    public void update(T entity) {

        getSession().update(entity);
    }

    @Override
    @Transactional
    public void delete(T entity) {

        getSession().delete(entity);
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public List<T> getAll() {
        return getSession().createQuery("from " + this.clazz.getName()).list();
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public T getById(Class<T> entity, final Long id) {

        return (T) getSession().get(entity, id);
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public T getById(Class<T> entity, final String id) {

        return (T) getSession().get(entity, id);
    }
    
    protected SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    protected void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }
}
