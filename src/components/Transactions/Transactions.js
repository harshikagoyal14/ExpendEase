import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ReactComponent as Edit } from "../../icons/edit.svg";
import { ReactComponent as Delete } from "../../icons/delete.svg";
import { ReactComponent as Food } from "../../icons/food.svg";
import { ReactComponent as Travel } from "../../icons/travel.svg";
import { ReactComponent as Shopping } from "../../icons/shopping.svg";
import { ReactComponent as Bills } from "../../icons/bills.svg";
import { ReactComponent as Others } from "../../icons/others.svg";
import { ReactComponent as Plus } from "../../icons/plus1.svg";
import MyLoader from "./TransactionLoading";
import "../../styles/Transactions.css";
import "../../index.css";

function Transactions({ transactions,setTransactions,user,setEditEnabled,setFormData, descriptionChars }) {
  
  const [transactionsLoading, setTransactionsLoading] = useState(true); 
  const [dateFillter, setDateFilter] = useState("");
  const [transactionFilter, setTransactionFilter] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  useEffect(() => {


    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/transactions"); 
        setTransactions(response.data);
        setTransactionsLoading(false);
      } catch (error) {
        toast.error("Error fetching transactions.");
        setTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

 const handleEdit = (transactionId, index) => {
    setEditEnabled(true);
    const editedTransaction = { ...transactions.find(e => e.transactionId === transactionId) };
    const date = new Date(editedTransaction.date);
    const formattedDate = date.toISOString().split("T")[0];
    editedTransaction.date = formattedDate;
    setFormData(editedTransaction);
  };

/* const addTransaction = async (newTransactionData) => {
  try {
    await axios.post("http://localhost:3000/api/transactions", newTransactionData);
    toast.success("Transaction added successfully.");
    // Fetch updated transactions after adding
    const response = await axios.get("http://localhost:3000/api/transactions");
    setTransactions(response.data);
  } catch (error) {
    toast.error("Error adding transaction.");
  }
}; */

const TransactionTypeChange = async (e) => {
  try {
    let filteredTransactions = [];
    if (e.target.value === "All") {
      const response = await axios.get("http://localhost:3000/api/transactions"); // Fetch all transactions
      filteredTransactions = response.data;
    } else {
      const response = await axios.get(`http://localhost:3000/api/transactions?type=${e.target.value}`); // Fetch transactions filtered by type
      filteredTransactions = response.data;
    }
    
    setTransactions(filteredTransactions);
    setTransactionType(e.target.value);
    setCategoryFilter(""); // Clear category filter
    setDateFilter(""); // Clear date filter

    localStorage.setItem("transactionType", e.target.value);
  } catch (error) {
    toast.error("Error filtering transactions by type.");
  } finally {
    closeDropdown(); // Close the dropdown regardless of success or failure
  }
};

const CategoryChange = async (e) => {
  try {
    let filteredTransactions = [];
    if (e.target.value === "All") {
      const response = await axios.get("http://localhost:3000/api/transactions"); // Fetch all transactions
      filteredTransactions = response.data;
    } else {
      const response = await axios.get(`http://localhost:3000/api/transactions?category=${e.target.value}`); // Fetch transactions filtered by category
      filteredTransactions = response.data;
    }
    
    setTransactions(filteredTransactions);
    setCategoryFilter(e.target.value);
    setTransactionType(""); // Clear transaction type filter
    setDateFilter(""); // Clear date filter

    localStorage.setItem("categoryFilter", e.target.value);
  } catch (error) {
    toast.error("Error filtering transactions by category.");
  } finally {
    closeCategoryDropdown(); // Close the category dropdown regardless of success or failure
  }
};

const changeDateFilter = async (e) => {
  try {
    let filteredTransactions = [];
    if (e.target.value) {
      const response = await axios.get(`http://localhost:3000/api/transactions?date=${e.target.value}`); // Fetch transactions filtered by date
      filteredTransactions = response.data;
    } else {
      const response = await axios.get("http://localhost:3000/api/transactions"); // Fetch all transactions
      filteredTransactions = response.data;
    }
    
    setTransactions(filteredTransactions);
    setDateFilter(e.target.value);
    setTransactionType(""); // Clear transaction type filter
    setCategoryFilter(""); // Clear category filter

    localStorage.setItem("dateFilter", e.target.value);
  } catch (error) {
    toast.error("Error filtering transactions by date.");
  }
};

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const closeCategoryDropdown = () => {
    setCategoryDropdownOpen(false);
  };

  /*
  const updateTransaction = async (transactionId, updatedTransactionData) => {
  try {
    await axios.put(`http://localhost:3000/api/transactions/${transactionId}`, updatedTransactionData);
    toast.success("Transaction updated successfully.");
    const response = await axios.get("http://localhost:3000/api/transactions");
    setTransactions(response.data);
  } catch (error) {
    toast.error("Error updating transaction.");
  }
 };
 */

  const handleDelete = async (transactionId, index) => {
    try {
      const response = await fetch(`http://localhost:3000/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }
      // Remove the deleted transaction from the UI
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction._id !== transactionId)
      );
      toast.success("Transaction deleted successfully.");
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error("Error deleting transaction.");
    }
  };
  


  return (
        <div>
            <div className="transaction-group row flex flex-col">
                <h4 className="font-bold transition-all duration-500">Transactions</h4>
                <hr className="border-[#b6cefc] border-0.5 dark:border-[#B6CEFC80] transition-all duration-500" />
                <div className="flex justify-between mt-3">
                    <div className="form-group col-md-4">
                    <div className="custom-dropdown dark:bg-[#011019] transition-colors duration-500" onBlur={closeDropdown} tabIndex={0}>
                        <div className="selected-value w-[126px] px-4 rounded cursor-pointer border-[1px]  border-black dark:border-[#B6CEFC80]" onClick={toggleDropdown}>
                        {transactionType || "Type"}<i className="arrow down border-black transition-all duration-500 dark:border-[#B6CEFC80]"></i>
                        </div>
                        {isDropdownOpen && (
                        <div className="options rounded-sm shadow-lg shadow-slate-400/40 absolute z-50 w-[126px] py-[3px] px-[2.5px]">
                            <div onClick={() => TransactionTypeChange({ target: { value: "All" } })} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white ">All</div>
                            <div onClick={() => TransactionTypeChange({ target: { value: "Income" } })} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Income</div>
                            <div onClick={() => TransactionTypeChange({ target: { value: "Expense" } })} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Expense</div>
                        </div>
                        )}
                    </div>
                    </div>
                    <div>
                    <div className="form-group col-md-4">
                    <div className="custom-dropdown dark:bg-[#011019] transition-colors duration-500" onBlur={closeCategoryDropdown} tabIndex={0}>
                        <div className="selected-value w-[126px] px-4 rounded cursor-pointer border-[1px] border-black dark:border-[#B6CEFC80]" onClick={toggleCategoryDropdown}>
                        {categoryFilter || "Category"}<i className="arrow down border-black transition-all duration-500 dark:border-[#B6CEFC80]"></i>
                        </div>
                        {isCategoryDropdownOpen && (
                        <div className="options rounded-sm shadow-lg shadow-slate-400/40 absolute z-50 w-[126px] py-[3px] px-[2.5px]">
                            <div onClick={() => CategoryChange({ target: { value: "All" } })} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">All</div>
                            <div onClick={() => CategoryChange({ target: { value: "Food" } })} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Food</div>
                            <div onClick={() => CategoryChange({ target: { value: "Travel" } })} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Travel</div>
                            <div onClick={() => CategoryChange({ target: { value: "Shopping" } })} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Shopping</div>
                            <div onClick={() => CategoryChange({ target: { value: "Bills" } })} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Bills</div>
                            <div onClick={() => CategoryChange({ target: { value: "Others" } })} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Others</div>
                        </div>
                        )}
                    </div>
                    </div>
                    </div>
                    <input
                    type="date"
                    name="date"
                    value={dateFillter}
                    onChange={(e) => changeDateFilter(e)}
                    placeholder="Date"
                    required
                    className="selected-value cursor-pointer max_with border border-slate-500 rounded-md bg-transparent h-[26px] px-1 transition duration-500 dark:border-[#B6CEFC80] dark:bg-[#011019]"
                    />
                </div>
            </div>

            {transactionFilter.length > 0
              ? (
                <ul className="transactions_container flex flex-col gap-2">
                {transactionFilter.map((transaction, index) => (
                  transaction.transactionType === "Income"
                    ? (
                    <li key={index} className="dark:bg-[#011019] income flex justify-between items-center border border-[#6e9df7] dark:border-[#B6CEFC80] rounded p-2 transition-all duration-500">
                        <div className="icon_container transition-all duration-500 bg-[#b6cefc] dark:bg-[#335467]">
                        <Plus className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" />
                        </div>
                        <div className="descDate_container">
                        {transaction.description.length > descriptionChars ? <h4>{transaction.description.substring(0, descriptionChars) + "..."}</h4> : <h4>{transaction.description}</h4>}
                        <p>{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                        <h1>+&#x20B9;{transaction.amount}</h1>
                        <div className="editDelete_container">
                        <Edit className="edit_icon" onClick={() => handleEdit(transaction.transactionId, index)} />
                        <Delete className="delete_icon" onClick={() => handleDelete(transaction.transactionId, index)} />
                        </div>
                    </li>
                      )
                    : (
                    <li key={index} className="dark:bg-[#011019] outcome flex justify-between items-center border border-[#6e9df7] dark:border-[#B6CEFC80] rounded p-2 transition-all duration-500">
                        <div className="icon_container transition-all duration-500 bg-[#b6cefc] dark:bg-[#335467]">
                        {transaction.category === "Food" ? <Food className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" /> : null}
                        {transaction.category === "Travel" ? <Travel className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" /> : null}
                        {transaction.category === "Shopping" ? <Shopping className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" /> : null}
                        {transaction.category === "Bills" ? <Bills className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" /> : null}
                        {transaction.category === "Others" ? <Others className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" /> : null}
                        </div>
                        <div className="descDate_container">
                        {transaction.description.length > descriptionChars ? <h4>{transaction.description.substring(0, descriptionChars) + "..."}</h4> : <h4>{transaction.description}</h4>}
                        <p>{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                        <h1>-&#x20B9;{transaction.amount}</h1>
                        <div className="editDelete_container">
                        <Edit className="edit_icon" onClick={() => handleEdit(transaction.transactionId, index)} />
                        <Delete className="delete_icon" onClick={() => handleDelete(transaction.transactionId, index)} />
                        </div>
                    </li>
                      )
                ))}
                </ul>
                )
              : (
                  transactionsLoading ? <MyLoader /> : <p className="text-gray-400">No transactions added yet.</p>
                )}
        </div>
  );
}

export default Transactions;
