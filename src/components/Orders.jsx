import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import defaultOrdersValues from '../utils/defaultOrdersValues'

export const Orders = ({ orders, articles, updateOrderById, createNewOrder, deleteOrderById }) => {

    const { register, handleSubmit, reset } = useForm()
    const [updateOrder, setUpdateOrder] = useState({status: false, id: false})

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    const submit = data => {
    
        try {    

            if(updateOrder.status)
                updateOrderById(updateOrder.id, data)
            else
                createNewOrder(data)
    
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: `Orden ${ updateOrder.status ? 'actualizada' : 'creada'  } correctamente`,
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: `No se pudo ${ updateOrder.status ? 'actualizar' : 'crear'  } la orden`,
                confirmButtonText: 'OK'
            })
        }
    }

    const handleCreate = () => {

        reset(defaultOrdersValues)
        setUpdateOrder({status: false, id: false})            

    }

    const handleUpdate = order => {

        reset(order)
        setUpdateOrder({status: true, id: order.id})
    }

    const handleDelete = id => {

        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción no se puede revertir!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminalo'
        }).then((result) => {
            if (result.isConfirmed) {

                try {
                    deleteOrderById(id)
                    Swal.fire(
                        'Eliminado',
                        'El pedido se eliminó correctamente.',
                        'success'
                    )
                } catch (error) {
                    console.log(error)
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: 'No se pudo eliminar el pedido',
                        confirmButtonText: 'OK'
                    })
                }
            }
        })
    }

    return (
        <article className='mb-3'>
            <div className='card'>
                <header className='card-header'><i className="fas fa-archive"></i> Pedidos</header>
                <div className='card-body'>
                    {
                        articles?.length > 0 ?
                            <button className='btn btn-success mb-3' data-bs-toggle="modal" data-bs-target="#pedidoModal" onClick={() => handleCreate()}>Nuevo pedido</button>
                        :
                        <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Primero se debe agregar un articulo">
                            <button class="btn btn-success mb-3" type="button" disabled>Nuevo pedido</button>
                        </span>
                    }
                    <div className="modal fade" id="pedidoModal" aria-labelledby="pedidoModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="pedidoModalLabel">{ updateOrder.status ? 'Editar pedido' : 'Nuevo pedido'}</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleSubmit(submit)}>
                                    <div className="modal-body row">
                                        <div className="col-md-12">
                                            <select {...register('articleId', { required: true } )} className="form-select mb-3" id="articleId">
                                                <option selected disabled value="">Elija un articulo</option>
                                                {
                                                    articles?.map(article => (
                                                        <option key={article.id} value={article.id}>{article.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="col-md-12">
                                            <input {...register('quantity', { required: true } )} type="number" className="form-control" id="quantity" placeholder="Cantidad" />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">{ updateOrder.status ? 'Actualizar pedido' : 'Cargar pedido'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <table className="table table-striped table-hover mb-0 border">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Precio neto</th>
                                <th scope="col">Precio bruto</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders?.length > 0 ?
                                    orders?.map(order => {

                                        const art = articles?.filter(article => article.id.toString() === order.articleId)[0]

                                        return <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{ art.price * order.quantity }</td>
                                            <td>{ art.price * order.quantity + (((art.price * order.quantity) * art.tax) / 100)}</td>

                                            <td scope="col" className="text-center">
                                                <button className='btn btn-sm btn-primary mx-2' data-bs-toggle="modal" data-bs-target="#pedidoModal" onClick={() => handleUpdate(order)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className='btn btn-sm btn-danger mx-2' onClick={() => handleDelete(order.id)}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>                                    
                                    })
                                :
                                <tr>
                                    <td colSpan="4" className='text-center'>No hay pedidos</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </article>
    )
}
