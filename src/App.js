import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState('');
    const [search, setSearch] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const baseURL='https://rest-api-ashy-seven.vercel.app';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('${baseURL}/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addProduct = async () => {
        try {
            const newProduct = { name, price: parseFloat(price), description, rating: parseFloat(rating) };
            await axios.post('${baseURL}/products', newProduct);
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const updateProduct = async () => {
        try {
            const updatedProduct = { name, price: parseFloat(price), description, rating: parseFloat(rating) };
            await axios.put(`${baseURL}/products/${editId}`, updatedProduct);
            fetchProducts();
            resetForm();
            setEditMode(false);
            setEditId(null);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete('${baseURL}/products/${id}');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const startEdit = (product) => {
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setRating(product.rating);
        setEditMode(true);
        setEditId(product._id);
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setDescription('');
        setRating('');
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="App">
            <header>
                <h1>Game Catalog</h1>
                <input 
                    type="text" 
                    placeholder="Search products" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </header>
            <main>
                <section className="add-product">
                    <h2>{editMode ? "Edit Game" : "Add New Game"}</h2>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        />
                        <button onClick={editMode ? updateProduct : addProduct}>
                            {editMode ? "Update Game" : "Add Game"}
                        </button>
                        {editMode && <button onClick={resetForm}>Cancel</button>}
                    </div>
                </section>
                <section className="product-list">
                    <h2>Games</h2>
                    <ul>
                        {filteredProducts.map(product => (
                            <li key={product._id}>
                                <h3>{product.name}</h3>
                                <p>Price: ${product.price}</p>
                                <p>{product.description}</p>
                                <p>Rating: {product.rating}</p>
                                <button onClick={() => startEdit(product)}>Edit</button>
                                <button onClick={() => deleteProduct(product._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
}

export default App;