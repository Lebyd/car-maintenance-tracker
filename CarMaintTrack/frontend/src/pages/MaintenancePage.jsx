import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function MaintenancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [filters, setFilters] = useState({
    carId: "",
  });

  const [formData, setFormData] = useState({
    carId: "",
    serviceType: "",
    serviceDate: "",
    mileageAtService: "",
    cost: "",
    notes: "",
    performedBy: "",
  });

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (filters.carId) params.carId = filters.carId;

      const res = await apiClient.get("/maintenance", { params });

      // maintenance endpoint returns { data, pagination }
      setRecords(res.data.data || res.data);
    } catch (err) {
      setError("Failed to load maintenance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchMaintenance();
  };

  const handleClearFilters = () => {
    setFilters({ carId: "" });
    fetchMaintenance();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.carId ||
      !formData.serviceType.trim() ||
      !formData.serviceDate ||
      !formData.mileageAtService
    ) {
      setError("Please fill in all required fields (*).");
      return;
    }

    try {
      const payload = {
        ...formData,
        carId: Number(formData.carId),
        mileageAtService: Number(formData.mileageAtService),
        cost: formData.cost ? Number(formData.cost) : null,
      };

      await apiClient.post("/maintenance", payload);
      setSuccess("Maintenance record added successfully.");

      setFormData({
        carId: "",
        serviceType: "",
        serviceDate: "",
        mileageAtService: "",
        cost: "",
        notes: "",
        performedBy: "",
      });

      fetchMaintenance();
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.message ||
          "Failed to add maintenance record."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this maintenance record?")) return;
    setError("");
    setSuccess("");

    try {
      await apiClient.delete(`/maintenance/${id}`);
      setSuccess("Maintenance record deleted successfully.");
      fetchMaintenance();
    } catch (err) {
      setError("Failed to delete maintenance record.");
    }
  };

  return (
    <div className="container">
      <h1>Maintenance Records</h1>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filters */}
      <section className="card">
        <h2>Filter by Car</h2>
        <form onSubmit={handleFilterSubmit} className="form-grid">
          <div className="form-group">
            <label>
              Car ID:
              <input
                type="number"
                name="carId"
                value={filters.carId}
                onChange={handleFilterChange}
              />
            </label>
          </div>

          <div className="form-group">
            <button type="submit" className="btn-primary">
              Apply Filter
            </button>
          </div>

          <div className="form-group">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClearFilters}
            >
              Clear Filter
            </button>
          </div>
        </form>
      </section>

      {/* Add Maintenance Record */}
      <section className="card">
        <h2>Add Maintenance Record</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>
              Car ID*:
              <input
                type="number"
                name="carId"
                value={formData.carId}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Service Type*:
              <input
                type="text"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                placeholder="Oil change, brake service, etc."
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Service Date*:
              <input
                type="date"
                name="serviceDate"
                value={formData.serviceDate}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Mileage at Service*:
              <input
                type="number"
                name="mileageAtService"
                value={formData.mileageAtService}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Cost:
              <input
                type="number"
                step="0.01"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Performed By:
              <input
                type="text"
                name="performedBy"
                value={formData.performedBy}
                onChange={handleChange}
                placeholder="Mechanic name or shop"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Notes:
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional notes"
              />
            </label>
          </div>

          <button type="submit" className="btn-primary">
            Save Record
          </button>
        </form>
      </section>

      {/* Maintenance List */}
      <section className="card">
        <h2>All Maintenance Records</h2>
        {loading ? (
          <p>Loading maintenance records...</p>
        ) : records.length === 0 ? (
          <p>No maintenance records found. Try changing filters or add one above.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Car ID</th>
                <th>Service Type</th>
                <th>Date</th>
                <th>Mileage</th>
                <th>Cost</th>
                <th>Performed By</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.id}</td>
                  <td>{rec.carId}</td>
                  <td>{rec.serviceType}</td>
                  <td>
                    {rec.serviceDate
                      ? new Date(rec.serviceDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td>{rec.mileageAtService}</td>
                  <td>
                    {rec.cost !== null && rec.cost !== undefined
                      ? `$${rec.cost}`
                      : "-"}
                  </td>
                  <td>{rec.performedBy}</td>
                  <td>{rec.notes}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(rec.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default MaintenancePage;
