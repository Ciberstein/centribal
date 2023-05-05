import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import defaultArticleValues from '../utils/defaultArticlesValues'

export const Articles = ({ articles, createNewArticle, updateArticleById, deleteArticleById }) => {

    const { register, handleSubmit, reset } = useForm()

    const [updateArticle, setUpdateArticle] = useState({status: false, id: false})

    const submit = data => {
    
        try {    

            if(updateArticle.status)
                updateArticleById(updateArticle.id, data)
            else
                createNewArticle(data)
    
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: `Articulo ${ updateArticle.status ? 'actualizado' : 'creado'  } correctamente`,
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: `No se pudo ${ updateArticle.status ? 'actualizar' : 'crear'  } el artículo`,
                confirmButtonText: 'OK'
            })
        }
    }

    const handleCreate = () => {
        reset(defaultArticleValues)
        setUpdateArticle({status: false, id: false})
    }

    const handleUpdate = article => {

        reset(article)
        setUpdateArticle({status: true, id: article.id})
    }

    const handleDelete = id => {

        Swal.fire({
            title: '¿Estás seguro?',
            text: "También se eliminarán TODOS los pedidos asociados a este articulo",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminalo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                try {
                    deleteArticleById(id)
                    Swal.fire(
                        'Eliminado',
                        'El articulo se eliminó correctamente.',
                        'success'
                    )
                } catch (error) {
                    console.log(error)
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: 'No se pudo eliminar el articulo',
                        confirmButtonText: 'OK'
                    })
                }
            }
        })
    }

    return (
        <article className='mb-3'>
            <div className='card'>
                <header className='card-header'><i className="fas fa-boxes"></i> Articulos</header>
                <div className='card-body'>
                    <button className='btn btn-success mb-3' data-bs-toggle="modal" data-bs-target="#articuloModal" onClick={() => handleCreate()}>Nuevo articulo</button>
                    <div className="modal fade" id="articuloModal" aria-labelledby="articuloModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="articuloModalLabel">{ updateArticle.status ? 'Editar articulo' : 'Nuevo articulo'}</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleSubmit(submit)}>
                                    <div className="modal-body row">
                                        <div className='col-md-6'>
                                            <input type="text" {...register('reference', { required: true } )} id="articleReference" placeholder="Referencia" className="form-control mb-3"/>
                                        </div>
                                        <div className='col-md-6'>
                                            <input type="text" {...register('name', { required: true } )} id="articleName" placeholder="Nombre" className="form-control mb-3" />
                                        </div>
                                        <div className='col-md-12'>
                                            <textarea {...register('description', { required: true } )} id="articleDescription" placeholder='Descripción' cols="10" rows="4" className="form-control mb-3"></textarea>
                                        </div>
                                        <div className='col-md-6'>
                                            <input type="number" {...register('price', { required: true } )} id="articlePrice" placeholder="Precio" className="form-control" />
                                        </div>
                                        <div className='col-md-6'>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text">%</span>
                                                <input type="number" {...register('tax', { required: true } )} id="articleTax" placeholder="Impuesto" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">{ updateArticle.status ? 'Actualizar articulo' : 'Cargar articulo'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <table className="table table-striped table-hover mb-0 border">
                        <thead>
                            <tr>
                                <th scope="col">Referencia</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Precio</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                articles?.length > 0 ?
                                    articles?.map(article => (
                                        <tr key={article.id}>
                                            <td>{article.reference}</td>
                                            <td>{article.name}</td>
                                            <td>{article.price}</td>
                                            <td scope="col" className="text-center">
                                                <button className='btn btn-sm btn-primary mx-2' data-bs-toggle="modal" data-bs-target="#articuloModal" onClick={() => handleUpdate(article)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className='btn btn-sm btn-danger mx-2' onClick={() => handleDelete(article.id)}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>                                    
                                    ))
                                :
                                <tr>
                                    <td colSpan="4" className='text-center'>No hay articulos</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </article>
    )
}
