import React from "react";
const styles = {
  container: {
    maxHeight: "80vh",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    width: "250px",
  },
  item: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
  selectedItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    background: "#eee",
  },
  subContianer: {
    marginLeft: "16px",
  },
};
const NavList = ({ onNavItemClick, activeToc, item }) => {
  console.log("check active toc", activeToc);
  return (
    <div style={styles.subContianer}>
      <div
        key={item.id}
        style={activeToc === item.id ? styles.selectedItem : styles.item}
        onClick={() => {
          onNavItemClick(item);
        }}
      >
        {item.label}
      </div>
      {item.subitems.map((subitems) => (
        <NavList
          onNavItemClick={onNavItemClick}
          activeToc={activeToc}
          item={subitems}
        />
      ))}
    </div>
  );
};

export default NavList;
