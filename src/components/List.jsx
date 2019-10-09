import React from 'react';

const List = ({ items, onDeleteItem }) => (
  <div>
    {items.map(item => (
      <div className="item" key={item.id}>
        <div className="header-item">
          <h2>{item.title}</h2>
          <button className="btn-delete" onClick={() => onDeleteItem(item)}>
            Delete
          </button>
        </div>
        <p className="desc">{item.description}</p>
      </div>
    ))}
  </div>
);

export default List;
