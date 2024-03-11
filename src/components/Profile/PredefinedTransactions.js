import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import plusFill from "../../icons/ph_plus-fill.svg";
import PredefinedTransactionsCards from "./PredefinedTransactionsCards";
import "../../styles/PredefinedTransactions.css";
import axios from "axios";
import { toast } from "react-toastify";

const PredefinedTransactions = () => {
  const userJWTToken = JSON.parse(localStorage.getItem("userJWTToken"));

  const [transactionType, setTransactionType] = useState("Expense");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [formData,setFormData]=useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    if (userJWTToken) {
      fetchDataFromProtectedAPI(userJWTToken);
    }
  }, [userJWTToken]);

  const fetchDataFromProtectedAPI = async (userToken) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      };
      const response = await axios.get("http://localhost:3000/api/user", config);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching data:", error);
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormVisible(true);
    const today = new Date();
    if (formData.transactionType === "") {
      toast.error("Please select a transaction type.");
      return;
    }
    if (formData.transactionType === "Income" && formData.category !== "NULL") {
      setFormData({ ...formData, category: "NULL" });
    }
    if (formData.transactionType === "Expense" && formData.category === "") {
      toast.error("Please select a category.");
      return;
    }
    if (formData.date === "") {
      toast.error("Please select a date.");
      return;
    }
    const selectedDate = new Date(formData.date);
    if (selectedDate > today) {
      toast.error("Please select a date in the past or present.");
      return;
    }
    if (formData.amount === "") {
      toast.error("Please enter an amount.");
      return;
    }
    if (formData.description === "") {
      toast.error("Please enter a description.");
      return;
    }
    try {
       await axios.put(`http://localhost:3000/api/transactions/${formData._id}`, formData);
       toast.success("Transaction edited successfully.");
      
        await axios.post("http://localhost:3000/api/transactions", { ...formData, userEmail: user.email });
        toast.success("Transaction added successfully.");
        console.log(formData);
      
      setFormData({
        transactionType: "",
        category: "",
        date: "",
        amount: "",
        description: ""
      }); 

    } catch (error) {
      console.error("Error:", error);
      toast.error("Error adding/editing transaction.");
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    setFormVisible(false);
  };

  console.log(transactionType);
  return (
    <>
      <div className='relative sm:left-60 -left-0 sm:w-[calc(100%-240px)] w-[100%] pl-2'>
        <div className='font-[Inter] '>
          <h1 className='font-bold text-[#024164] sm:text-xl text-base mb-6 sm:text-left text-center'>
            Predefined Transactions
          </h1>
          <h2 className='font-medium text-[19px] text-[#024164] mb-2 text-center sm:text-left'>
            Income/Expense
          </h2>
          <div className='flex flex-wrap gap-5 sm:justify-start justify-center'>
            <div className='w-60 h-64 border-2 border-[#9EBEFA] flex flex-col justify-center items-center cursor-pointer' onClick={handleSubmit}>
              <img src={plusFill} alt='' />
              <button className='text-sm font-semibold text-white bg-[#9EBEFA] w-[167px] h-[35px] rounded-xl'>
                Add New Transactions
              </button>
            </div>
            <PredefinedTransactionsCards />
          </div>
        </div>
      </div>
      <div className={`form-container absolute z-10 w-full h-full flex justify-center items-center ${formVisible ? "pointer-events-auto" : "pointer-events-none"} ${formVisible ? "opacity-1" : "opacity-0"} transition-opacity duration-1000`}>
      
        {/* Main Form */}
        <form className='form relative w-[34.5rem] h-[25.25rem] flex py-10 px-8 font-[Inter]'>
          <button className='close-button absolute top-2 right-2 text-3xl' onClick={ (e) => handleCloseClick(e) }>
            <RxCross2/>
          </button>

          {/* Left side of the form */}
          <div className="form-left w-[50%] flex flex-col">
            <div className="transaction-type h-[33.33%]">
              <p className="font-semibold">Transaction Type</p>
              <div>
                <input
                  type="radio"
                  name="transactionType"
                  value="Income"
                  id="income"
                  checked={transactionType === "Income"}
                  onChange={() => setTransactionType("Income")}
                  className="mr-2 appearance-none w-3 h-3 bg-slate-300 rounded-full"
                />
                <label htmlFor="income">Income</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="transactionType"
                  value="Expense"
                  id="expense"
                  defaultChecked={transactionType === "Expense"}
                  onChange={() => setTransactionType("Expense")}
                  className="mr-2 appearance-none w-3 h-3 bg-slate-300 rounded-full"
                />
                <label htmlFor="expense">Expense</label>
              </div>
            </div>
            <div className="category-type h-[33.33%]">
              <label htmlFor="category" className="block font-semibold">Category</label>
              <div className="w-[10.25rem] h-[2.2rem] relative">
                <select
                  name="categoryType"
                  id="categoryType"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-[100%] h-[100%] border border-[#6E9DF7] border-opacity-50 appearance-none px-2 bg-white">
                  <option value="food">Food</option>
                  <option value="travel">Travel</option>
                  <option value="shopping">Shopping</option>
                  <option value="bills">Bills</option>
                  <option value="others">Others</option>
                </select>
                <span className="absolute h-[100%] top-[2px] right-1 pointer-events-none">
                  <IoIosArrowUp/>
                  <IoIosArrowDown/>
                </span>
              </div>
            </div>
            <div className="date h-[33.33%]">
              <label htmlFor="date" className="block font-semibold">Date</label>
              <input
                type="date"
                name="date"
                id="transaction-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-[10.25rem] h-[2.2rem] border border-[#6E9DF7] border-opacity-50 px-2"/>
            </div>
          </div>

          {/* Right side of the form */}
          <div className="form-right w-[50%] flex flex-col">
            <div className="amount h-[33.33%]">
              <label htmlFor="amount" className="block font-semibold">Amount</label>
              <input
                type="number"
                name=''
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-[10.25rem] h-[2.2rem] border border-[#6E9DF7] border-opacity-50 px-2 appearance-none"/>
            </div>
            <div className="description h-[33.33%]">
              <label htmlFor="description" className="block font-semibold">Description</label>
              <input
                type="text"
                name=""
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-[10.25rem] h-[2.2rem] border border-[#6E9DF7] border-opacity-50 px-2"/>
            </div>
            <div className="h-[33.33%]">
              <button className="w-[10.25rem] h-[2.2rem] bg-[#6E9DF7] bg-opacity-80 font-bold mt-6">Add Transaction</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PredefinedTransactions;
