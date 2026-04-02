import React, { useState } from "react";
import "./App.css";

function App() {
  const [role, setRole] = useState("viewer");

  const [transactions, setTransactions] = useState([
    { date: "2026-04-01", category: "Salary", amount: 5000, type: "income" },
    { date: "2026-04-02", category: "Food", amount: 200, type: "expense" },
    { date: "2026-04-03", category: "Shopping", amount: 500, type: "expense" }
  ]);

  const [form, setForm] = useState({
    category: "",
    amount: "",
    type: "income"
  });

  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Add or Update
  const handleSubmit = () => {
    if (!form.category || !form.amount) {
      alert("Fill all fields");
      return;
    }

    if (editIndex === null) {
      setTransactions([
        ...transactions,
        {
          date: new Date().toISOString().split("T")[0],
          ...form,
          amount: Number(form.amount)
        }
      ]);
    } else {
      const updated = [...transactions];
      updated[editIndex] = {
        ...updated[editIndex],
        ...form,
        amount: Number(form.amount)
      };
      setTransactions(updated);
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({ category: "", amount: "", type: "income" });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const t = transactions[index];
    setForm({
      category: t.category,
      amount: t.amount,
      type: t.type
    });
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
  };

  const filtered = transactions.filter(
    (t) =>
      t.category.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || t.type === filter)
  );

  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  // Insights
  const getInsights = () => {
    const categoryTotals = {};
    filtered.forEach((t) => {
      if (t.type === "expense") {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    let maxCat = "";
    let maxVal = 0;

    for (let cat in categoryTotals) {
      if (categoryTotals[cat] > maxVal) {
        maxVal = categoryTotals[cat];
        maxCat = cat;
      }
    }

    return maxCat
      ? `Highest spending is on ${maxCat} (${maxVal})`
      : "No insights available";
  };

  return (
    <div>
      <header className="header">
        <h2>Finance Dashboard</h2>
        <div>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </header>

      <div className="container">
        {/* Cards */}
        <div className="cards">
          <div className="card">
            <h3>Balance</h3>
            <p>{balance}</p>
          </div>
          <div className="card">
            <h3>Income</h3>
            <p>{income}</p>
          </div>
          <div className="card">
            <h3>Expenses</h3>
            <p>{expense}</p>
          </div>
        </div>

        {/* Admin Form */}
        {role === "admin" && (
          <div className="form">
            <h3>{editIndex === null ? "Add" : "Edit"} Transaction</h3>
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <button onClick={handleSubmit}>Save</button>
            <button onClick={resetForm}>Cancel</button>
          </div>
        )}

        {/* Filters */}
        <div className="filters">
          <input
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Table */}
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
              {role === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, index) => (
              <tr key={index}>
                <td>{t.date}</td>
                <td>{t.category}</td>
                <td>{t.amount}</td>
                <td>{t.type}</td>
                {role === "admin" && (
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Insights */}
        <div className="insights">
          <h3>Insights</h3>
          <p>{getInsights()}</p>
        </div>
      </div>
    </div>
  );
}

export default App;