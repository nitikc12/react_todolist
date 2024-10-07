import "./App.css";
import { useState, useEffect } from "react";

function App() {
  let [todoList, setTodoList] = useState([]);
  let [editIndex, setEditIndex] = useState(null);
  //Keeps track of which todo item is being edited
  let [editValue, setEditValue] = useState("");
  //Holds the current value of the todo item being edited.
  let [showModal, setShowModal] = useState(false);
  //Controls whether the confirmation modal is visible (true or false)
  let [deleteIndex, setDeleteIndex] = useState(null);
  //deleteIndex: Stores the index of the todo item selected for deletion.

  let [deleteItemName, setDeleteItemName] = useState("");
  //deleteItemName: Holds the name of the item to be deleted.

  useEffect(() => {
    const storedTodoList = localStorage.getItem("todoList");
    if (storedTodoList) {
      setTodoList(JSON.parse(storedTodoList));
    }
  }, []);

  const saveToDoList = (event) => {
    event.preventDefault();
    const toName = editValue.trim();

    if (!todoList.includes(toName) && toName) {
      const finalDoList = [...todoList, toName];
      setTodoList(finalDoList);
      localStorage.setItem("todoList", JSON.stringify(finalDoList));
      setEditValue(""); // Clear the input after saving
    } else {
      alert("Todo name already exists or is empty");
    }
  };

  const editToDoItem = (index) => {
    setEditIndex(index); //Updates editIndex to the index of the item clicked for editing.
    setEditValue(todoList[index]); //Sets editValue to the current value of the todo item being edited.
  };

  const saveEdit = (event) => {
    event.preventDefault();
    const updatedList = [...todoList];
    updatedList[editIndex] = editValue;
    setTodoList(updatedList);
    localStorage.setItem("todoList", JSON.stringify(updatedList));
    setEditIndex(null); // Clears the editIndex, indicating no item is being edited anymore
    setEditValue(""); //Resets the input field used for editing.
  };

  const openModal = (index) => {
    setShowModal(true);
    setDeleteItemName(todoList[index]);
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const finalData = todoList.filter((_, i) => i !== deleteIndex);
      setTodoList(finalData);
      localStorage.setItem("todoList", JSON.stringify(finalData));
    }
    setShowModal(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteIndex(null);
  };

  const list = todoList.map((value, index) => (
    <ToDoListItems
      value={value}
      key={index}
      indexNumber={index}
      editToDoItem={editToDoItem}
      openModal={openModal}
    />
  ));

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form onSubmit={editIndex !== null ? saveEdit : saveToDoList}>
        <input
          type="text"
          name="toName"
          required
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)} // Update editValue directly
        />
      </form>
      <div className="outerDiv">
        <ul>{list}</ul>
      </div>

      {showModal && (
        <ConfirmationModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          itemName={deleteItemName}
        />
      )}
    </div>
  );
}

function ToDoListItems({ value, indexNumber, editToDoItem, openModal }) {
  let [checked, setChecked] = useState(false); //Initializes status to false, representing whether
  //the todo item is completed or not.

  const checkStatus = () => {
    setChecked(!checked); // Toggles the item's completion status
  };

  return (
    <li className={checked ? "completetodo" : ""}>
      {indexNumber + 1}. {value}
      <input type="checkbox" onChange={checkStatus} />
      <div className="buttons">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openModal(indexNumber);
          }}
        >
          Delete
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            editToDoItem(indexNumber);
          }}
        >
          Edit
        </button>
      </div>
    </li>
  );
}

function ConfirmationModal({ onConfirm, onCancel, itemName }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Do you really want to delete "{itemName}"?</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
}

export default App;
