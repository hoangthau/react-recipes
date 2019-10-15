import React from 'react';

const RecipeList = ({ items, onDeleteItem }) => (
  <>
    {items.map(item => (
      <div className="item" key={item.id}>
        <div className="item-heading">
          <h2>{item.title}</h2>
          <button className="btn-delete" onClick={() => onDeleteItem(item)}>
            Delete
          </button>
        </div>
        <p className="item-desc">{item.description}</p>
      </div>
    ))}
  </>
);

export default RecipeList;
