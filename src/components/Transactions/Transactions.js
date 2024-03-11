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

function Transactions({ transactions, setTransactions, user, setEditEnabled, setFormData, descriptionChars }) {

  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
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
    const editedTransaction = { ...transactions.find(e => e._id === transactionId) };
    const date = new Date(editedTransaction.date);
    const formattedDate = date.toISOString().split("T")[0];
    editedTransaction.date = formattedDate;
    setFormData(editedTransaction);
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (transactionType !== "") {
      filtered = filtered.filter(transaction => transaction.transactionType === transactionType);
    }

    if (categoryFilter !== "") {
      filtered = filtered.filter(transaction => transaction.category === categoryFilter);
    }

    if (dateFilter !== "") {
      filtered = filtered.filter(transaction => new Date(transaction.date).toISOString().split("T")[0] === dateFilter);
    }

    return filtered;
  };

  const handleChange = (e, type) => {
    const value = e.target.value;

    switch (type) {
      case "type":
        setTransactionType(value);
        break;
      case "category":
        setCategoryFilter(value);
        break;
      case "date":
        setDateFilter(value);
        break;
      default:
        break;
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
                  <div onClick={() => handleChange({ target: { value: "" } }, "type")} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white ">All</div>
                  <div onClick={() => handleChange({ target: { value: "Income" } }, "type")} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Income</div>
                  <div onClick={() => handleChange({ target: { value: "Expense" } }, "type")} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Expense</div>
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
                    <div onClick={() => handleChange({ target: { value: "" } }, "category")} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">All</div>
                    <div onClick={() => handleChange({ target: { value: "Food" } }, "category")} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Food</div>
                    <div onClick={() => handleChange({ target: { value: "Travel" } }, "category")} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Travel</div>
                    <div onClick={() => handleChange({ target: { value: "Shopping" } }, "category")} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Shopping</div>
                    <div onClick={() => handleChange({ target: { value: "Bills" } }, "category")} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Bills</div>
                    <div onClick={() => handleChange({ target: { value: "Others" } }, "category")} className="option bg-white text-start cursor-pointer px-4 py-[2.5px] hover:bg-[#0481C8] hover:text-white">Others</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <input
            type="date"
            name="date"
            value={dateFilter}
            onChange={(e) => handleChange(e, "date")}
            placeholder="Date"
            required
            className="selected-value cursor-pointer max_with border border-slate-500 rounded-md bg-transparent h-[26px] px-1 transition duration-500 dark:border-[#B6CEFC80] dark:bg-[#011019]"
          />
        </div>
      </div>

      {transactionsLoading ? <MyLoader /> : (
        <ul className="transactions_container flex flex-col gap-2">
          {filterTransactions().length > 0 ? (
            filterTransactions().map((transaction, index) => (
              <li key={index} className={`dark:bg-[#011019] ${transaction.transactionType === "Income" ? "income" : "outcome"} flex justify-between items-center border border-[#6e9df7] dark:border-[#B6CEFC80] rounded p-2 transition-all duration-500`}>
                <div className="icon_container transition-all duration-500 bg-[#b6cefc] dark:bg-[#335467]">
                  {transaction.transactionType === "Income" ? <Plus className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" /> :
                    (transaction.category === "Food" ? <Food className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" /> :
                      (transaction.category === "Travel" ? <Travel className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" /> :
                        (transaction.category === "Shopping" ? <Shopping className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" /> :
                          (transaction.category === "Bills" ? <Bills className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" /> :
                            <Others className="icons transition-all duration-500 fill-[#6e9df7] dark:fill-[rgba(19,43,57,1)]" />))))}
                </div>
                <div className="descDate_container">
                  {transaction.description.length > descriptionChars ? <h4>{transaction.description.substring(0, descriptionChars) + "..."}</h4> : <h4>{transaction.description}</h4>}
                  <p>{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <h1>{transaction.transactionType === "Income" ? `+₹${transaction.amount}` : `-₹${transaction.amount}`}</h1>
                <div className="editDelete_container">
                  <Edit className="edit_icon" onClick={() => handleEdit(transaction._id, index)} />
                  <Delete className="delete_icon" onClick={() => handleDelete(transaction._id, index)} />
                </div>
              </li>
            ))
          ) : <p className="text-gray-400">No transactions found.</p>}
        </ul>
      )}
    </div>
  );
}

export default Transactions;
