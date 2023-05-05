import { useEffect, useState } from 'react'
import { Articles } from './components/Articles'
import { Orders } from './components/Orders'
import axios from 'axios'
import { Footer } from './components/Footer'

function App() {

  const port = 5000
  const endpoint = 'http://localhost'

  const [articles, setArticles] = useState()
  const [orders, setOrders] = useState()

  const getAllArticles = () => {
    const url = `${endpoint}:${port}/articles`
    axios.get(url)
    .then(res => setArticles(res.data))
    .catch(err => console.log(err))
  }

  const getAllorders = () => {
    const url = `${endpoint}:${port}/orders`
    axios.get(url)
    .then(res => setOrders(res.data))
    .catch(err => console.log(err))
  }

  const createNewArticle = data => {
    const url = `${endpoint}:${port}/articles`
    axios.post(url, data)
    .then(() => {
      getAllArticles()
    })
    .catch(err => console.log(err))
  }

  const updateArticleById = (id, data) => {
    const url = `${endpoint}:${port}/articles/${id}/`
    axios.put(url, data)
    .then(() => {
      getAllArticles()
      getAllorders()
    })
    .catch(err => console.log(err))
  }

  const deleteOrderByArticleId = articleId => {

    axios.get(`${endpoint}:${port}/orders?articleId=${articleId}/`)
    .then(res => {
      res.data.forEach(order => {
        deleteOrderById(order.id)
      });
      getAllorders()
    })
    .catch(err => {
      console.log(err);
    });

  }

  const deleteArticleById = id => {

    deleteOrderByArticleId(id)

    const url = `${endpoint}:${port}/articles/${id}/`
    axios.delete(url)
    .then(() => {
      getAllArticles()
    })
    .catch(err => console.log(err))
  }

  const createNewOrder = data => {
    const url = `${endpoint}:${port}/orders`
    axios.post(url, data)
    .then(() => {
      getAllorders()
    })
    .catch(err => console.log(err))
  }

  const updateOrderById = (id, data) => {
    const url = `${endpoint}:${port}/orders/${id}/`
    axios.put(url, data)
    .then(() => {
      getAllorders()
    })
    .catch(err => console.log(err))
  }

  const deleteOrderById = id => {
    const url = `${endpoint}:${port}/orders/${id}/`
    axios.delete(url)
    .then(() => {
      getAllorders()
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    getAllArticles()
    getAllorders()
  }, [])

  return (
    <div className='App'>
      <main className='container'>
        <header className='py-4 text-center'>
          <h1>Prueba técnica</h1>
          <h3>Centribal</h3>          
        </header>
        <hr />
        <div className='row'>
          <div className='col-md'>
            <Articles 
              articles={articles}
              createNewArticle={createNewArticle}
              updateArticleById={updateArticleById}
              deleteArticleById={deleteArticleById}
            />
          </div>
          <div className='col-md'>
            <Orders 
              orders={orders}
              articles={articles}
              createNewOrder={createNewOrder}
              updateOrderById={updateOrderById}
              deleteOrderById={deleteOrderById}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
