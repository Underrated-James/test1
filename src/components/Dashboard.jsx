import React, { useState } from 'react';
import { Modal, Form, Button, Container, Row, Col } from 'react-bootstrap';
import AddProductButton from './subcomponents/AddProductButton';
import SearchBar from './subcomponents/SearchBar';
import CategoryFilter from './subcomponents/CategoryFilter';
import PriceSort from './subcomponents/PriceSort';
import ProductCard from './subcomponents/ProductCard';
import './Dashboard.css';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    quantity: '',
    category: '',
    description: '',
  });
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProductIndex, setCurrentProductIndex] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    const newProduct = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      id: Date.now(), // Generate unique ID
    };
    setProducts(prev => [...prev, newProduct]);
    setFormData({ title: '', price: '', quantity: '', category: '', description: '' });
    setShowModal(false);
  };

  const handleEditProduct = (index) => {
    setCurrentProductIndex(index);
    setFormData(products[index]);
    setEditModal(true);
  };

  const handleUpdateProduct = () => {
    const updatedProducts = [...products];
    updatedProducts[currentProductIndex] = formData;
    setProducts(updatedProducts);
    setEditModal(false);
    alert("Product Updated Successfully!");
  };

  const handleDeleteProduct = (index) => {
    setProductToDelete(index);
    setConfirmDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const updatedProducts = products.filter((_, i) => i !== productToDelete);
    setProducts(updatedProducts);
    setConfirmDeleteModal(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (priceFilter === 'low-to-high') return a.price - b.price;
    if (priceFilter === 'high-to-low') return b.price - a.price;
    return 0;
  });

  const allCategories = [...new Set(products.map(p => p.category))];

  const toggleCategory = (category, isChecked) => {
    if (isChecked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== category));
    }
  };

  return (
    <Container>
      <AddProductButton onClick={() => setShowModal(true)} />
      <SearchBar searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} />
      <CategoryFilter categories={allCategories} selectedCategories={selectedCategories} onCategoryChange={toggleCategory} />
      <PriceSort value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} />

      <Row>
        {sortedProducts.map((product, index) => (
          <Col md={4} key={index} className="d-flex justify-content-center">
            <ProductCard
              product={product}
              onEdit={() => handleEditProduct(index)}
              onDelete={() => handleDeleteProduct(index)}
            />
          </Col>
        ))}
      </Row>

      {/* Add Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={formData.category} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddProduct}>Add Product</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={formData.category} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateProduct}>Update Product</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={confirmDeleteModal} onHide={() => setConfirmDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => {
            handleConfirmDelete();
            setConfirmDeleteModal(false);
          }}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;