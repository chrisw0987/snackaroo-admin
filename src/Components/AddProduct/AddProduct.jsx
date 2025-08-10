import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const API = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

  const [image, setImage] = useState(null);

  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: 'sweets',
    new_price: '',
    old_price: '',
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0] || null);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    try {
      if (!productDetails.name.trim()) {
        alert('Please enter a product title.');
        return;
      }
      if (!image) {
        alert('Please upload an image.');
        return;
      }

      const formData = new FormData();
      formData.append('product', image);

      const uploadRes = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadData?.success) {
        console.error('Upload failed:', uploadData);
        alert('Image upload failed.');
        return;
      }

      const imgUrl =
        uploadData.image_url ||
        (uploadData.image_path ? `${API}/${uploadData.image_path}` : '');

      if (!imgUrl) {
        alert('Could not determine uploaded image URL.');
        return;
      }

      const product = {
        ...productDetails,
        image: imgUrl,
      };

      const addRes = await fetch(`${API}/addproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      const addData = await addRes.json();

      if (addData?.success) {
        alert('Product Added');
        setProductDetails({
          name: '',
          image: '',
          category: 'sweets',
          new_price: '',
          old_price: '',
        });
        setImage(null);
      } else {
        console.error('Add product failed:', addData);
        alert('Failed to add product.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong adding the product.');
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type Here"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="crunchy">Crunchy</option>
          <option value="sweets">Sweets</option>
          <option value="drinks">Drinks</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt="preview"
          />
        </label>
        <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
      </div>

      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
